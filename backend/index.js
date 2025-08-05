import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import multer from "multer";

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
  weekDay: z.string().length(3),
  time: z.string().length(11),
  location: z.string(),
});
const courseSchema = z.object({
  className: z.string(),
  occurences: z.array(eventSchema),
});
// const coursesSchema = z.object({
//   courses: z.array(courseSchema),
//   unsure: z.string(),
// });
const coursesSchema = z.object({
  courses: z.array(courseSchema),
});
const courseCountSchema = z.object({ atLeastOne: z.boolean() });

// AI functions
async function textOpenAI(courseText) {
  const processInputInstructions =
    "ENSURE TO EXTRACT EVERY CLASS | From the following text, extract class names. And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: 00:00-23:59), location (building and room, or remote). Extract the calendar events from the following text: ";
  const input = processInputInstructions + courseText;
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    // input: [
    //   { role: "system", content: processInputInstructions },
    //   { role: "user", content: courseText },
    // ],
    input: input,
    text: {
      format: zodTextFormat(coursesSchema, "courses"),
    },
  });
  return response;
}

async function imageOpenAI(base64ImageUrl) {
  // const processInputInstructions =
  // "First tell me what you're unsure of (what may be challenging to process). Don't include notes such as 'Enrolled', 'Seats', and 'Wait List' as part of the course details; focus solely on class names, times, and locations. From the following image, extract class names (Ensure each classname is accurate). And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: HH:MM-HH:MM; don't include AM and/or PM), location (building and room, or remote).  Extract the calendar events from the following image: ";
  //   const processInputInstructions =
  //     "From the following image, extract class names (usually the classname is above LEC) (the image structure is class code, class name, weekdays and times, section (ex: LEC 007; don't care about section)). And for each classname, find all occurences (times when the class occurs. Almost all classes should contain at least two lectures). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: HH:MM-HH:MM; don't include AM and/or PM), location (building and room, or remote).  Extract the calendar events from the following image: ";
  const processInputInstructions = "Extract all test from this image";
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
    // text: {
    //   format: zodTextFormat(coursesSchema, "courses"),
    // },
  });

  return response;
}

// Ensure AI parsed input correctly
async function isAtLeastOneCourse(instructions) {
  const response = await client.responses.parse({
    model: "gpt-4.1-nano",
    input: instructions,
    text: {
      format: zodTextFormat(courseCountSchema, "atleastOne"),
    },
  });
  return response;
}
async function validateResponse(courses) {
  // THIS FUNCTION IS NOT COMPLETE.
  let processCount = 0;
  const processCountCapacity = 3;
  const checkMoreThanOneCourseInstructions =
    "Determine whether there is more than one course from the following: ";

  let [atLeastOneCourse, response] = await Promise.all([
    checkMoreThanOneCourse(checkMoreThanOneCourseInstructions + courses),
    processInput(processInputInstructions + coursesInput),
  ]);
  let parsedAtLeastOneCourse = JSON.parse(atLeastOneCourse.output_text);
  let validationResult = coursesSchema.safeParse(
    JSON.parse(response.output_text)
  );

  while (
    !validationResult.success ||
    !(
      parsedAtLeastOneCourse.atLeastOne ===
      validationResult.data.courses.length > 1
    )
  ) {
    if (processCount < processCountCapacity) {
      response = await processInput(processInputInstructions + coursesInput);
      validationResult = coursesSchema.safeParse(
        JSON.parse(response.output_text)
      );
    } else {
      console.error("Zod validation failed:", validationResult.error);
      return res.status(500).json({
        message:
          "AI response was not in the expected format. Please try again.",
      });
    }
  }

  const parsedResponse = validationResult.data; // This is what you'll likely return
}

function createCalendarEvents(parsedResponse) {
  const calendarEvents = {};
  console.log(`What model response is unsure of: ${parsedResponse.unsure}`);

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
  console.log(`req.file.mimetype: ${req.file.mimetype}`);
  const imageUrl = `data:${req.file.mimetype};base64,${imageAsBase64}`;

  let imageResponse = await imageOpenAI(imageUrl);
  console.log(`-------Text Response------- ${imageResponse.output_text}`);
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
  console.log(`Calendar Events: ${JSON.stringify(calendarEvents)}`);

  res.json(calendarEvents);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
