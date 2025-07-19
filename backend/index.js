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
        input: "ENSURE TO EXTRACT EVERY CLASS | From the following text, extract class names. And for each classname, find all occurences (times when the class occurs). For each occurence say the weekday (format: Mon, Tue, Wed, Thu, Fri, Sat, Sun), time (format: 00:00-23:59), location (building and room, or remote), and possibly any links (like a zoom link if given) . Extract the calendar events from the following text: Foundations of Speech Communication SPCH 11100 Shepard Hall Rm S-276 Tue/Thurs 2pm-3:15pm; Cross-Cultural Perspectives ANTH 20100 NAC Rm 6/213 Mon/Wed 12:30 to 1:45pm; Introduction to Computing for Majors CSC 10300 Marshak Rm MR3 Tue/Thurs 11 to 11:50am and NAC Rm 7/118 Fri 11 to 12:40pm; Elements of Linear Algebra MATH 34600 NAC Rm 5/110 Tue/Thurs 9:30am - 10:45am; Discrete Mathematical Structures 1 CSC 10400 Shepard Hall Rm S-205 Tue/Thurs 4 to 5:40pm and NAC Rm 7/306 Fri 1 to 2:40pm",
        text: {
            format: zodTextFormat(courses, "courses"),
        },
    });

    const parsedResponse = JSON.parse(response.output_text)

    // Format calendar events to send to frontend UI
    const calendarEvents = [];
    // const colors = []

    // let earliestCourseTime;
    // let latestCourseTime;

    for (const i in parsedResponse.courses) {
        // const color = colors[i]
        for (const properties of parsedResponse.courses[i].occurences) {
            properties.id = `${parsedResponse.courses[i].className}-${properties.weekDay}-${properties.time}`;
            // properties.color = color
            calendarEvents.push(properties);

            // const startHour = properties.time.substring(0,2)    // 00:00-23:59
            // const startMin = properties.time.substring(3,5)
            // const endHour = properties.time.substring(6,8)
            // const endMin = properties.time.substring(9,11)
            // if (earliestCourseTime.substring(0,2))
        }        
    }
    
    // If a student has a course that start very early or ends very late, the program may have to conditionally enable scrolling in the Calendar Week UI
    // calendarEvents.push({earliestCourseTime: earliestCourseTime, latestCourseTime: latestCourseTime});
    // nvm, delete the earlieststart and end later. Keeping rn to reference later
    // Delete since you will loop through all start and end tiems late in frontend anyways, this is something the frontend should take care of

    res.json(calendarEvents);
    
});


app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))
