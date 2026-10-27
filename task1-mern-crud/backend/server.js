require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "signup-api" });
});

app.use("/api/auth", authRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled API error:", err.message);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI. Add it to backend/.env.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
