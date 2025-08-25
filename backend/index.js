import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { imageToEvents, textToEvents } from "./generate-events.js";
import { getColleges, getSemesterDetails } from "./college-semester.js";

dotenv.config();
const PORT = process.env.PORT; // 3000;

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// api endpoints
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/process-text", async (req, res) => {
  console.log("in /api/process-text");

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "No text provided" });
  }

  const calendarEvents = await textToEvents(text);

  res.json(calendarEvents);
});

app.post("/api/process-image", upload.single("image"), async (req, res) => {
  console.log("In /api/process-image");
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const calendarEvents = await imageToEvents(req.file);
  return res.json(calendarEvents);
});

app.get("/api/colleges", (req, res) => {
  const colleges = getColleges();
  return res.json(colleges);
});

app.post("/api/semester-details", (req, res) => {
  const { college } = req.body || {};
  if (typeof college !== "string" || college.trim().length === 0) {
    return res.status(400).json({ message: "Invalid or missing 'college'" });
  }
  const details = getSemesterDetails(college);
  return res.json(details);
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) {
    console.error(err);
  }
  return res.status(status).json({ message });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
