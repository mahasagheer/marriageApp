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


// === Fetch Complete Matrix ===
exports.getMatrix = async (req, res) => {
  const { agencyId, userId } = req.params; // userId = fromUserId

  try {
    const matrixDoc = await VisibilityMatrix.findOne({ agencyId });

    if (!matrixDoc) {
      return res.status(404).json({ message: "Matrix not found" });
    }

    const fromMap = matrixDoc.matrix.get(userId); // get map for this userId

    if (!fromMap) {
      return res.status(404).json({ message: `No visibility data for user ${userId}` });
    }

    // Convert Map to plain object
    const visibilityMap = Object.fromEntries(fromMap); // { toUserId1: true, toUserId2: false }

    res.json({
      userId,
      visibility: visibilityMap,
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
