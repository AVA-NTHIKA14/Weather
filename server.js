require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Root route - explicitly serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/config", (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    
    const { data } = await axios.get(url);
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    
    const { data } = await axios.get(url);
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch forecast" });
  }
});

// Catch-all route - serve index.html for any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Use PORT from environment or default to 3000 (for local dev)
const PORT = process.env.PORT || 3000;

// For local development
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel serverless environment
module.exports = app;

