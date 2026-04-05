const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Automatically excludes password from queries for safety
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "editor", "viewer"],
        message: "{VALUE} is not a valid role",
      },
      default: "viewer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
  },
  {
    timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
  },
);

module.exports = mongoose.model("User", UserSchema);
