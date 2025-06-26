import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.post("/a", async (req, res) => {
  const { symptoms } = req.body;

  try {
    // 🔁 Forward symptoms to Flask API
    const flaskResponse = await axios.post("http://localhost:5000/predict", {
      symptoms
    });

    // 🎯 Send Flask response back to frontend
    res.json(flaskResponse.data);
  } catch (error) {
    console.error("Error contacting Flask:", error.message);
    res.status(500).json({ error: "Failed to get prediction from Flask API" });
  }
});

app.listen(port, () => {
  console.log(`Node backend running at http://localhost:${port}`);
});
