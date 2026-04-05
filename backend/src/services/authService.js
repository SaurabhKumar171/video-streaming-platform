const User = require("../models/User");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (userData) => {
  const { username, password, role, organizationName, organizationId } =
    userData;

  // 1. Check if user exists
  const existingUser = await User.findOne({ username });
  if (existingUser) throw new Error("User already exists");

  let finalOrgId = organizationId;

  // 2. Logic: Create New Org OR Join Existing
  if (!finalOrgId) {
    if (!organizationName)
      throw new Error("Organization Name is required to create a new tenant");

    const newOrg = await Organization.create({ name: organizationName });
    finalOrgId = newOrg._id;
  } else {
    // Verify the organization actually exists if joining
    const orgExists = await Organization.findById(finalOrgId);
    if (!orgExists) throw new Error("Target organization does not exist");
  }

  // 3. Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create User
  // Note: If they created the org, force 'admin'. If joining, use the requested role.
  const user = await User.create({
    username,
    password: hashedPassword,
    role: organizationId ? role || "viewer" : "admin",
    organizationId: finalOrgId,
  });

  // 5. If it was a new org, set the owner
  if (!organizationId) {
    await Organization.findByIdAndUpdate(finalOrgId, { owner: user._id });
  }

  return user;
};

exports.loginUser = async (username, password) => {
  // Select organizationId as well
  const user = await User.findOne({ username }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  // CRITICAL: Include organizationId in the JWT
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: user.organizationId.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      organizationId: user.organizationId,
    },
  };
};
