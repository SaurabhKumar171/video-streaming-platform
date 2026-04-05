const User = require("../models/User");

// exports.getAllUsers = async (req, res) => {
//   try {
//     // SECURE: Filter by the logged-in user's organizationId
//     const users = await User.find({ organizationId: req.user.organizationId });

//     res.status(200).json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// exports.updateContent = async (req, res) => {
//   try {
//     const { title, body, postId } = req.body;

//     // Logic: If postId is provided, update; otherwise, create new.
//     let content;

//     if (postId) {
//       content = await Post.findByIdAndUpdate(
//         postId,
//         {
//           title,
//           body,
//           lastEditedBy: req.user.id, // Track who made the change
//         },
//         { new: true, runValidators: true },
//       );

//       if (!content) {
//         return res.status(404).json({ message: "Content not found" });
//       }
//     } else {
//       content = await Post.create({
//         title,
//         body,
//         author: req.user.id,
//         lastEditedBy: req.user.id,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Content ${postId ? "updated" : "created"} successfully by ${req.user.role}`,
//       data: content,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message || "Failed to process content",
//     });
//   }
// };

exports.getTenantUsers = async (req, res) => {
  try {
    // Isolated: Only find users belonging to the Admin's Org
    const users = await User.find({ organizationId: req.user.organizationId })
      .select("-password")
      .sort("-createdAt");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!userToDelete)
      return res
        .status(404)
        .json({ message: "User not found in your organization" });
    if (userToDelete.role === "admin")
      return res.status(403).json({ message: "Cannot delete an admin" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
