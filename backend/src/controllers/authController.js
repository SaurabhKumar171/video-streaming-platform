const authService = require("../services/authService");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res
      .status(201)
      .json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await authService.loginUser(username, password);

    // Set Cookie Options
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true, // Prevents JS access (Security!)
      secure: false, // Set to false for localhost/HTTP
      sameSite: "lax", // Required for cross-origin cookies in modern browsers
      path: "/",
    };

    res
      .status(200)
      .cookie("token", token, cookieOptions) // Send cookie to browser
      .json({
        success: true,
        user,
      });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Add a Logout to clear the cookie
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged out" });
};

exports.getMe = async (req, res) => {
  try {
    // 1. Check if req.user exists (passed from protect middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Not authorized, no user ID" });
    }

    const user = await User.findById(req.user.id).populate("organizationId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        // Safety check: only access .name if organizationId exists
        organizationName: user.organizationId
          ? user.organizationId.name
          : "No Organization",
        organizationId: user.organizationId ? user.organizationId._id : null,
      },
    });
  } catch (error) {
    console.error("GET_ME_ERROR:", error); // Check your terminal for this log!
    res.status(500).json({ message: "Server error during session check" });
  }
};
