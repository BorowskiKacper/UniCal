import express from "express";
import cors from "cors";
import dotenv, { parse } from "dotenv";
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

// Ensure robust responses from AI
async function parseText(text) {
  async function parseOnceFromText(text) {
    console.log("Parsing...");
    let response = await textOpenAI(text);

    let validationResult = coursesSchema.safeParse(
      JSON.parse(response.output_text)
    );

    if (!validationResult.success) {
      console.log("Zod validation failed:", validationResult.error);
      return "";
      // return res.status(500).json({
      //   message: "AI response was not in the expected format. Please try again.",
      // });
    }

    return validationResult.data;
  }

  async function parseTwiceFromText(text) {
    const toParse = [text, text];
    const parsed = await Promise.all(
      toParse.map((text) => reparseUntilMoreThanOneCourse(text))
    );
    return parsed;
  }

  async function reparseUntilMoreThanOneCourse(text, attempts = 5) {
    let parsed = "";
    for (let i = 0; i < attempts; i++) {
      parsed = await parseOnceFromText(text);

      if (parsed && getCourseCount(parsed) > 1) break;
    }
    return parsed;
  }

  function getCourseCount(parsed) {
    return parsed.courses.length;
  }

  function getEventCount(parsed) {
    let eventCount = 0;
    for (let i in parsed.courses) {
      console.log("parsed.courses[i]", parsed.courses[i]);
      eventCount += parsed.courses[i].occurences.length;
    }
    console.log("eventCount", eventCount);
    return eventCount;
  }

  function isRepeatedEvent(previousParses, newParsed) {
    const courseCount = getCourseCount(newParsed);
    const eventCount = getEventCount(newParsed);
    console.log("courseCount", courseCount);
    console.log("eventCount", eventCount);
    for (const [prevCourseCount, prevEventCount] of previousParses) {
      if (courseCount === prevCourseCount && eventCount === prevEventCount) {
        return true;
      }
    }
    return false;
  }

  let isMoreThanOneEvent = true;
  const parsedTwice = await parseTwiceFromText(text);
  isMoreThanOneEvent =
    getCourseCount(parsedTwice[0]) > 1 || getCourseCount(parsedTwice[1]) > 1;

  let previousParses = [
    [getCourseCount(parsedTwice[0]), getEventCount(parsedTwice[0])],
  ];
  let parsed = parsedTwice[1];

  const maxUniqueResults = 10;
  for (let i = 0; i < maxUniqueResults - 2; i++) {
    if (isRepeatedEvent(previousParses, parsed)) break;
    console.log("in loop. i:", i);

    previousParses.push([getCourseCount(parsed), getEventCount(parsed)]);
    parsed = await (isMoreThanOneEvent
      ? reparseUntilMoreThanOneCourse(text)
      : parseOnceFromText(text));
  }
  return parsed;
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

  const parsed = await parseText(text);
  const calendarEvents = createCalendarEvents(parsed);

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
  const imageResponse = await imageOpenAI(
    imageUrl,
    instructionsExtractTextFromImage
  );

  const parsed = await parseText(imageResponse.output_text);
  const calendarEvents = createCalendarEvents(parsed);

  res.json(calendarEvents);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
