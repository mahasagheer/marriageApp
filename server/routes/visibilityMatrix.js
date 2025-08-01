const express = require("express");
const router = express.Router();
const controller = require("../controllers/VisibilityMatrixController");
const auth = require('../middleware/auth');

// === Routes ===
router.post("/update/:agencyId", auth,controller.updateMatrix);
router.post("/make-profile-public/:agencyId", auth, controller.makeProfilePublic);
router.post("/make-profile-private/:agencyId", auth, controller.makeProfilePrivate);
router.get("/matrix/:agencyId/:userId",auth, controller.getMatrix);
router.get("/is-public/:userId/:agencyId", auth, controller.isProfilePublic);
router.get("/public-profiles/:agencyId", auth, controller.getPublicProfilesByAgency);
router.get("/matrix/:agencyId/user/:fromUserId/target/:toUserId", controller.checkVisibility);

module.exports = router;
