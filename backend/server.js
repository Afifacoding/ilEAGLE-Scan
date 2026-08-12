const express = require("express");
const cors = require("cors");

const { scanContent } = require("./src/scanner");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "2mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "IlEAGLE Scan backend is running",
    port: PORT,
  });
});

// Main scanner API
app.post("/api/scan", (req, res) => {
  try {
    const { input, type = "auto" } = req.body;

    if (!input || typeof input !== "string") {
      return res.status(400).json({
        success: false,
        error: "No valid input was provided.",
      });
    }

    if (input.length > 20000) {
      return res.status(400).json({
        success: false,
        error: "Input cannot exceed 20,000 characters.",
      });
    }

    const report = scanContent(input, type);

    return res.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("SCAN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "The scanner encountered an internal error.",
    });
  }
});

// Return safe JSON for malformed request bodies.
app.use((error, req, res, next) => {
  if (error && error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      error: "Malformed JSON payload.",
    });
  }

  if (error) {
    return res.status(500).json({
      success: false,
      error: "Internal server error.",
    });
  }

  return next();
});

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log("       IlEAGLE Scan Backend");
  console.log("======================================");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Scan:   POST http://localhost:${PORT}/api/scan`);
  console.log("======================================");
  console.log("");
});