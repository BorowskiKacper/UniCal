import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";


dotenv.config();
const PORT = process.env.PORT; // 3000;

const app = express();
const client = new OpenAI();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/process", async (req, res) => {
    const event = z.object({
        weekDay: z.string(),
        time: z.string(),
        // startTime: z.string(),
        // endTime: z.string(),
        location: z.string(),
        links: z.array(z.string()),
    });

    const course = z.object({
        className: z.string(),
        occurences: z.array(event)
    });

    const courses = z.object({courses: z.array(course)})
      
    
    const response = await client.responses.parse({
        model: "gpt-4.1-nano",
        input: "From the following text, extract class names. And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: 00:00-23:59), location (building and room, or remote), and possibly any links (like a zoom link if given) . Extract the calendar events from the following text: Foundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm; Introduction to Computing for Majors CSC 10300 Marshak Rm MR3 Tue/Thurs 11 to 11:50am and NAC Rm 7/118 Fri 11 to 12:40pm; Elements of Linear Algebra MATH 34600 NAC Rm 5/110 Tue/Thurs 9:30am - 10:45am; Discrete Mathematical Structures 1 CSC 10400 Shepard Hall Rm S-205 Tue/Thurs 4 to 5:40pm and NAC Rm 7/306 Fri 1 to 2:40pm",
        text: {
            format: zodTextFormat(courses, "courses"),
        },
    });


    console.log(`Response: ${response.output_text}`);
    res.json(response.output_text);
    
});


app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))
