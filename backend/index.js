import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";


dotenv.config();
const PORT = process.env.PORT; // 3000;

const app = express();
app.use(cors());
app.use(express.json());
const client = new OpenAI();

const eventSchema = z.object({
    weekDay: z.string(),
    time: z.string(),
    location: z.string(),
    // links: z.array(z.string()),
});

const courseSchema = z.object({
    className: z.string(),
    occurences: z.array(eventSchema)
});

const coursesSchema = z.object({courses: z.array(courseSchema)});

const courseCountSchema = z.object({atLeastOne: z.boolean()});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/api/process", async (req, res) => {
    const {coursesInput} = req.body;

    if (!coursesInput) {
        return res.status(400).json({message: "No input text provided"});
    }
    
    let processCount = 0;
    const processCountCapacity = 3;  
    const checkMoreThanOneCourseInstructions = "Determine whether there is more than one course from the following: ";
    const processInputInstructions = "ENSURE TO EXTRACT EVERY CLASS | From the following text, extract class names. And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: 00:00-23:59), location (building and room, or remote). Extract the calendar events from the following text: ";

    const processInput = async (input) => {
        const response = await client.responses.parse({
            model: "gpt-4.1-nano",
            input: input,
            text: {
                format: zodTextFormat(coursesSchema, "courses"),
            },
        });
        processCount++
        return response;
    }
    const checkMoreThanOneCourse = async (input) => {
        const response = await client.responses.parse({
            model: "gpt-4.1-nano",
            input: input,
            text: {
                format: zodTextFormat(courseCountSchema, "atleastOne"),
            },
        }); 
        return response;
    }

    let [atLeastOneCourse, response] = await Promise.all([checkMoreThanOneCourse(checkMoreThanOneCourseInstructions + coursesInput), processInput(processInputInstructions + coursesInput)]);
    let parsedAtLeastOneCourse = JSON.parse(atLeastOneCourse.output_text);
    let validationResult = coursesSchema.safeParse(JSON.parse(response.output_text));
    
    while (!validationResult.success || !((parsedAtLeastOneCourse.atLeastOne) === (validationResult.data.courses.length > 1))) {
        if (processCount < processCountCapacity) {
            response = await processInput(processInputInstructions + coursesInput);
            validationResult = coursesSchema.safeParse(JSON.parse(response.output_text));
        } else {
            console.error("Zod validation failed:", validationResult.error);
            return res.status(500).json({ message: "AI response was not in the expected format. Please try again." });
        }
    }

    const parsedResponse = validationResult.data

    const calendarEvents = {};
    // const colors = []

    for (const i in parsedResponse.courses) {
        // const color = colors[i]
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
            // properties.color = color
            calendarEvents[id] = properties;
        }        
    }
    
    res.json(calendarEvents);
});


app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))
