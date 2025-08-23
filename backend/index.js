import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import multer from "multer";
import pdf from "pdf-parse";

dotenv.config();
const PORT = process.env.PORT; // 3000;

const app = express();
app.use(cors());
app.use(express.json());
const client = new OpenAI();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Zod schemas for validating AI response format
const eventSchema = z.object({
  weekDay: z.enum(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/), // Matches format "HH:MM-HH:MM"
  location: z.string(),
});
const courseSchema = z.object({
  className: z.string(),
  classSection: z.string(),
  occurences: z.array(eventSchema),
});
const coursesSchema = z.object({
  courses: z.array(courseSchema),
});
const courseCountSchema = z.object({ atLeastOne: z.boolean() });

// AI functions
async function textOpenAI(courseText) {
  const processInputInstructions =
    "ENSURE TO EXTRACT EVERY CLASS | From the following text, extract class and section names. And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: 00:00-23:59), location (building and room, or remote). Extract the calendar events from the following text: ";
  const input = processInputInstructions + courseText;
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    input: input,
    text: {
      format: zodTextFormat(coursesSchema, "courses"),
    },
  });
  return response;
}

async function imageOpenAI(
  base64ImageUrl,
  processInputInstructions,
  schema = null
) {
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    input: [
      {
        role: "user",
        content: [
          { type: "input_text", text: processInputInstructions },
          {
            type: "input_image",
            image_url: base64ImageUrl,
          },
        ],
      },
    ],
    ...(schema && { text: { format: zodTextFormat(schema, "schema") } }),
  });

  return response;
}

// Creates calendar events to be sent to frontend
function createCalendarEvents(parsedResponse) {
  const calendarEvents = {};

  for (const i in parsedResponse.courses) {
    for (const properties of parsedResponse.courses[i].occurences) {
      const id = `${parsedResponse.courses[i].className}-${properties.weekDay}-${properties.time}`;
      properties.className = parsedResponse.courses[i].className;
      properties.description = `Location: ${properties.location}`;

      delete properties.location;
      let [startTime, endTime] = properties.time.split("-");
      if (startTime.length === 4) {
        startTime = "0" + startTime;
      }
      if (endTime.length === 4) {
        endTime = "0" + endTime;
      }
      properties.time = startTime + "-" + endTime;
      calendarEvents[id] = properties;
    }
  }

  return calendarEvents;
}

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
  console.log(`Processing: ${text}`);
  let response = await textOpenAI(text);
  console.log(`Processed response: ${response}`);

  let validationResult = coursesSchema.safeParse(
    JSON.parse(response.output_text)
  );

  if (!validationResult.success) {
    console.error("Zod validation failed:", validationResult.error);
    return res.status(500).json({
      message: "AI response was not in the expected format. Please try again.",
    });
  }

  const calendarEvents = createCalendarEvents(validationResult.data);
  console.log(`Calendar Events: ${JSON.stringify(calendarEvents)}`);

  res.json(calendarEvents);
});

app.post("/api/process-image", upload.single("image"), async (req, res) => {
  console.log("In /api/process-image");

  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  const imageAsBase64 = req.file.buffer.toString("base64");
  const imageUrl = `data:${req.file.mimetype};base64,${imageAsBase64}`;

  const instructionsExtractTextFromImage = "Extract all text from this image: ";
  let imageResponse = await imageOpenAI(
    imageUrl,
    instructionsExtractTextFromImage
  );
  let response = await textOpenAI(imageResponse.output_text);

  let validationResult = coursesSchema.safeParse(
    JSON.parse(response.output_text)
  );

  if (!validationResult.success) {
    console.error("Zod validation failed:", validationResult.error);
    return res.status(500).json({
      message: "AI response was not in the expected format. Please try again.",
    });
  }

  const calendarEvents = createCalendarEvents(validationResult.data);

  res.json(calendarEvents);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
