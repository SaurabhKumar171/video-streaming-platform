const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The admin who created it
  },
  { timestamps: true },
);

module.exports = mongoose.model("Organization", OrganizationSchema);
