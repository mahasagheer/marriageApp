const mongoose = require("mongoose");

const visibilityMatrixSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
    unique: true,
  },
  matrix: {
    type: Map,
    of: {
      type: Map,
      of: Boolean,
    },
    default: {},
  },
  publiclyVisibleUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VisibilityMatrix", visibilityMatrixSchema);
