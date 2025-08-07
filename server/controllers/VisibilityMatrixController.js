const VisibilityMatrix = require("../models/visibilityMatrix");
const Payment = require("../models/paymentConfirmation");
const ChatSession = require("../models/ChatSession");
const UserProfile = require("../models/UserProfile"); // for future use if needed
const jwt = require("jsonwebtoken"); // Make sure to install and import
const JWT_SECRET = process.env.JWT_SECRET; // Set in your .env

const transporter = require('nodemailer').createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    const profile = await UserProfile.findById(fromUserId).populate("userId");
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const targetUser = profile.userId;
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

    if (targetUser && targetUser.email && canSee === true) {
      // Generate JWT token for secure access
      const token = jwt.sign(
        { userId: targetUser._id ,accessId:toUserId},
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const profileURL = `${process.env.FRONTEND_URL}/public/user/${token}`;

      const subject = "Profile Visibility Granted";
      const message = `Hi ${targetUser.name},

An agency has granted access to see profile of a user.

You can now see profile of that user on the platform.

🔗 Access that user's profile: ${profileURL}

This link is valid for 24 hours.

Thank you!`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: targetUser.email,
        subject,
        text: message,
      });
    }

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
    const { agencyId } = req.params; // authenticated agency ID

    // Validate profile
    const profile = await UserProfile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const currentGender = profile.gender;
    const oppositeGender = currentGender === 'Male' ? 'Female' : 'Male';

    const otherProfiles = await UserProfile.find({
      _id: { $ne: profileId },
      gender: oppositeGender
    }).populate('userId');

    // Find or create visibility matrix
    let matrix = await VisibilityMatrix.findOne({ agencyId });
    if (!matrix) {
      matrix = new VisibilityMatrix({ agencyId, matrix: new Map(), publiclyVisibleUsers: [] });
    }

    const alreadyPublic = matrix.publiclyVisibleUsers.some(id => id.equals(profileId));
    if (alreadyPublic) {
      return res.status(200).json({ message: "Profile already public" });
    }

    matrix.publiclyVisibleUsers.push(profileId);
    matrix.updatedAt = Date.now();

    // ✅ Step 1: Find users who have chat sessions with the agency
    const sessions = await ChatSession.find({ agencyId }); // Assuming ChatSession has agencyId field
    const userIdsInChat = sessions.map(s => String(s.userId)); // Adjust field names if needed

    // ✅ Step 2: Update private matrix for each user to see this profile
    const profileKey = String(profileId);
    for (const userId of userIdsInChat) {
      const fromKey = userId;
      const toKey = profileKey;

      if (!matrix.matrix.has(fromKey)) {
        matrix.matrix.set(fromKey, new Map());
      }

      const innerMap = matrix.matrix.get(fromKey);
      innerMap.set(toKey, true);
      matrix.matrix.set(fromKey, innerMap);
    }

    await matrix.save();

    // Send emails
    for (let otherProfile of otherProfiles) {
      if (otherProfile?.userId?.email) {
        const token = jwt.sign(
          { userId: otherProfile.userId._id, accessId: profile._id },
          JWT_SECRET,
          { expiresIn: "1d" }
        );

        const profileURL = `${process.env.FRONTEND_URL}/public/user/${token}?id=${profile._id}`;

        const subject = "A New Public Profile Matches Your Preferences";
        const message = `Hi ${otherProfile.userId.name},

A new profile matching your preferences has just been made public.

🔗 View Profile: ${profileURL}

This link will expire in 24 hours.

Thank you!`;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: otherProfile.userId.email,
          subject,
          text: message,
        });
      }
    }

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


/**
 * Get all public user profiles for a specific agency
 */
exports.getPublicProfilesByAgency = async (req, res) => {
  try {
    const { agencyId } = req.params;

    const matrix = await VisibilityMatrix.findOne({ agencyId });

    if (!matrix || matrix.publiclyVisibleUsers.length === 0) {
      return res.status(200).json({ profiles: [] });
    }

    // Find UserProfiles where userId in publiclyVisibleUsers
    const profiles = await UserProfile.find({
      _id: { $in: matrix.publiclyVisibleUsers },
      isActive: true, // optional filter
    });

    return res.status(200).json({ profiles });
  } catch (error) {
    console.error("Error fetching public profiles:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
