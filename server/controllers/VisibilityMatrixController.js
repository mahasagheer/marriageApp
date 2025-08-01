const VisibilityMatrix = require("../models/visibilityMatrix");
const Payment = require("../models/paymentConfirmation");
const UserProfile = require("../models/UserProfile"); // for future use if needed

// === Create or Update Matrix Entry ===
exports.updateMatrix = async (req, res) => {
  const { agencyId } = req.params;
  const { fromUserId, toUserId, canSee } = req.body.visibilityData || {};
  if (!fromUserId || !toUserId || typeof canSee === "undefined") {
    return res.status(400).json({ error: "Missing required fields in body" });
  }

  try {
    let matrixDoc = await VisibilityMatrix.findOne({ agencyId });

    if (!matrixDoc) {
      matrixDoc = new VisibilityMatrix({ agencyId, matrix: new Map() });
    }

    const isPublic = matrixDoc.publiclyVisibleUsers.includes(toUserId);

    // if (canSee && !isPublic) {
    //   const payment = await Payment.findOne({
    //     agencyId,
    //     userId: toUserId,
    //     status: "verified",
    //   });

    //   if (!payment) {
    //     return res.status(400).json({
    //       message: `Payment required to view user ${toUserId}`,
    //     });
    //   }
    // }

    // Ensure keys are strings
    const fromKey = String(fromUserId);
    const toKey = String(toUserId);

    if (!matrixDoc.matrix.has(fromKey)) {
      matrixDoc.matrix.set(fromKey, new Map());
    }

    const innerMap = matrixDoc.matrix.get(fromKey);
    innerMap.set(toKey, canSee);
    matrixDoc.matrix.set(fromKey, innerMap);
    matrixDoc.updatedAt = new Date();

    await matrixDoc.save();

    res.json({ success: true, message: "Matrix updated", matrix: matrixDoc });
  } catch (err) {
    console.error("Update matrix error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMatrix = async (req, res) => {
  const { agencyId, userId } = req.params;

  try {
    const matrixDoc = await VisibilityMatrix.findOne({ agencyId });

    if (!matrixDoc) {
      return res.status(404).json({ message: "Matrix not found" });
    }

    const fromMap = matrixDoc.matrix.get(userId);

    if (!fromMap) {
      return res.status(404).json({ message: `No visibility data for user ${userId}` });
    }

    // Convert Map to object
    const visibilityMap = Object.fromEntries(fromMap);

    // Filter only those userIds whose value is `true`
    const visibleUserIds = Object.entries(visibilityMap)
      .filter(([_, isVisible]) => isVisible === true)
      .map(([toUserId]) => toUserId);

    // Fetch user profiles of visible users
    const visibleUserProfiles = await UserProfile.find({
      _id: { $in: visibleUserIds },
    });

    res.json({
      userId,
      visibility: visibilityMap,
      visibleProfiles: visibleUserProfiles,
    });

  } catch (err) {
    console.error("Fetch matrix error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// === Check Individual Visibility Entry ===
exports.checkVisibility = async (req, res) => {
  const { agencyId, fromUserId, toUserId } = req.params;

  try {
    const matrix = await VisibilityMatrix.findOne({ agencyId });

    if (!matrix) {
      return res.status(404).json({ visible: false, reason: "No matrix found" });
    }

    const isPublic = matrix.publiclyVisibleUsers.includes(toUserId);

    if (isPublic) {
      return res.json({ visible: true, reason: "public" });
    }

    const innerMap = matrix.matrix.get(fromUserId);
    const visible = innerMap?.get(toUserId) === true;

    res.json({ visible, reason: visible ? "manual/payment" : "not_allowed" });
  } catch (err) {
    console.error("Check visibility error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.makeProfilePublic = async (req, res) => {
  try {
    const { profileId } = req.body;
    const{ agencyId }= req.params; // authenticated agency ID
    // Validate profile
    const profile = await UserProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userId = profile.userId;

    // Find or create visibility matrix
    let matrix = await VisibilityMatrix.findOne({ agencyId });

    if (!matrix) {
      matrix = new VisibilityMatrix({ agencyId });
    }

    // Avoid duplicates
    const alreadyPublic = matrix.publiclyVisibleUsers.some(id => id.equals(profileId));
    if (alreadyPublic) {
      return res.status(200).json({ message: "Profile already public" });
    }

    matrix.publiclyVisibleUsers.push(profileId);
    matrix.updatedAt = Date.now();

    await matrix.save();

    return res.status(200).json({ message: "Profile made public successfully" });
  } catch (error) {
    console.error("Error making profile public:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.makeProfilePrivate = async (req, res) => {
  try {
    const { profileId } = req.body;
    const {agencyId} = req.params;

    const profile = await UserProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const userId = profile.userId;

    const matrix = await VisibilityMatrix.findOne({ agencyId });
    if (!matrix) {
      return res.status(404).json({ message: "Visibility matrix not found" });
    }

    // Remove userId from publiclyVisibleUsers array
    matrix.publiclyVisibleUsers = matrix.publiclyVisibleUsers.filter(
      (id) => !id.equals(profileId)
    );
    matrix.updatedAt = Date.now();

    await matrix.save();

    return res.status(200).json({ message: "Profile made private successfully" });
  } catch (error) {
    console.error("Error making profile private:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Check if a user's profile is publicly visible by the agency
 */
exports.isProfilePublic = async (req, res) => {
  try {
    const { userId,agencyId } = req.params;

    const matrix = await VisibilityMatrix.findOne({ agencyId });

    if (!matrix) {
      return res.status(200).json({ isPublic: false });
    }

    const isPublic = matrix.publiclyVisibleUsers.some(id => id.equals(userId));
    return res.status(200).json({ isPublic });
  } catch (error) {
    console.error("Error checking public visibility:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
