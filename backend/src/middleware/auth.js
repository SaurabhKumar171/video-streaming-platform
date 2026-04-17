const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach organizationId to the request object
    req.user = decoded;

    // Update the logger with the organization context ---
    if (req.user.organizationId) {
      req.log = req.log.child({ organizationId: req.user.organizationId });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Role-based Authorization: Restrict to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role ${req.user.role} is unauthorized` });
    }
    next();
  };
};
