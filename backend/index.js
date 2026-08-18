import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { imageToEvents, textToEvents } from "./generate-events.js";
// import { getColleges, getSemesterDetails } from "./college-semester.js";
import {
  getAllColleges,
  getTermsForCollege,
  getSemesterDetails,
} from "./sqlite.js";

dotenv.config();
const PORT = process.env.PORT || 8080; // Cloud Run provides PORT; default to 8080

// Terms that ended more than this many months ago are hidden from /db/colleges-terms
const TERM_LOOKBACK_MONTHS = 6;

// Returns the date `months` months before today as a 'YYYY-MM-DD' string.
// Built from local date components rather than toISOString(), which converts to
// UTC first and can land on the wrong calendar day near midnight.
function monthsAgoISODate(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
  }),
);
app.use(express.json());

// Firebase ID token verification (via Google JWKS)
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
if (!firebaseProjectId) {
  console.warn(
    "FIREBASE_PROJECT_ID is not set. Token verification will fail. Set it in environment.",
  );
}
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
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

/*
* returns an array of college objects
* Each college object has format: 
* {id: int, 
  name: str, 
  acronym: str, 
  timezone: str, 
  academic_terms: [{id: int, college_id: int, name: str, start_date: 'YYYY-MM-DD' (str), end_date: 'YYYY-MM-DD' (str)}]
*
* academic_terms only includes terms ending on or after the cutoff date,
* which is TERM_LOOKBACK_MONTHS months before today. Colleges left with no
* terms are omitted entirely, so they never reach the dropdown.
*/
app.get("/db/colleges-terms", (req, res) => {
  const earliestTermEnd = monthsAgoISODate(TERM_LOOKBACK_MONTHS);
  const colleges = getAllColleges();

  for (const college of colleges) {
    college.academic_terms = getTermsForCollege(college.id, earliestTermEnd);
  }

  return res.json(
    colleges.filter((college) => college.academic_terms.length > 0),
  );
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

app.post("/api/db/semester-details", (req, res) => {
  const { termID } = req.body || {};
  if (typeof termID !== "number" || termID <= 0) {
    return res.status(400).json({ message: "Invalid or missing 'termID'" });
  }
  const details = getSemesterDetails(termID);
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
