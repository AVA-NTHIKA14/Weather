require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.static("public"));

app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    
    const { data } = await axios.get(url);
    res.json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
