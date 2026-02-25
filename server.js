const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/budget-tracker",
);

// MongoDB Connection Events
mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Routes (CommonJS style)
app.use(require("./routes/api.js"));

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 App running on port ${PORT}`);
});