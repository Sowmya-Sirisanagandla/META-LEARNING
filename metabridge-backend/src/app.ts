import express from "express";
import cors from "cors";
import axios from "axios";
import doctorRoutes from "./routes/doctorRoutes";
import patientRoutes from "./routes/patientRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);

// ❤️ HEART ML ROUTE
app.post("/api/heart", async (req, res) => {
  try {
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/predict_heart",
      req.body
    );
    res.json(flaskResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Heart prediction failed" });
  }
});

// 💙 DIABETES ML ROUTE
app.post("/api/diabetes", async (req, res) => {
  try {
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/predict_diabetes",
      req.body
    );
    res.json(flaskResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Diabetes prediction failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend running");
});

export default app;
