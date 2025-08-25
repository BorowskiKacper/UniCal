import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { imageToEvents, textToEvents } from "./generate-events.js";

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

  res.json(calendarEvents);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
