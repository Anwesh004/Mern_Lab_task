const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

function validateCredentials(email, password) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Enter a valid email address.";
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return "Password must be between 8 and 128 characters.";
  }
  return null;
}

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const validationError = validateCredentials(email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email: normalizedEmail, passwordHash });

    return res.status(201).json({
      message: "Account created successfully.",
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    // Handles the race where two requests try to register the same email.
    if (error && error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) return res.status(401).json({ message: "Invalid email or password." });

    return res.json({
      message: "Login successful.",
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
