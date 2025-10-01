import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { imageToEvents, textToEvents } from "./generate-events.js";
import { getColleges, getSemesterDetails } from "./college-semester.js";

dotenv.config();
const PORT = process.env.PORT || 8080; // Cloud Run provides PORT; default to 8080

const app = express();

// CORS configuration: allow prod domain and localhost in dev
const allowedOrigins = new Set([
  "https://collegetocalendar.com",
  "https://www.collegetocalendar.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
]);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Non-browser or same-origin
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());

// Firebase ID token verification (via Google JWKS)
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
if (!firebaseProjectId) {
  console.warn(
    "FIREBASE_PROJECT_ID is not set. Token verification will fail. Set it in environment."
  );
}
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      audience: firebaseProjectId,
    });
    req.user = { uid: payload.sub, email: payload.email };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Unprotected endpoints
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/colleges", (req, res) => {
  const colleges = getColleges();
  return res.json(colleges);
});

// Protect all other /api/* routes
app.use("/api", authenticate);

// Protected endpoints
app.post("/api/process-text", async (req, res) => {
  console.log("in /api/process-text", req.user?.uid);
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "No text provided" });
  }
  const calendarEvents = await textToEvents(text);
  return res.json(calendarEvents);
});

app.post("/api/process-image", upload.single("image"), async (req, res) => {
  console.log("In /api/process-image", req.user?.uid);
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }
  const calendarEvents = await imageToEvents(req.file);
  return res.json(calendarEvents);
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
