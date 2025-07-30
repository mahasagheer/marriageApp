const express = require("express");
const router = express.Router();
const controller = require("../controllers/VisibilityMatrixController");

// === Routes ===
router.post("/update/:agencyId", controller.updateMatrix);
router.get("/matrix/:agencyId/:userId", controller.getMatrix);
router.get("/matrix/:agencyId/user/:fromUserId/target/:toUserId", controller.checkVisibility);

module.exports = router;
