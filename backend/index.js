import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";

dotenv.config();
const PORT = process.env.PORT; // 3000;

const app = express();
const client = new OpenAI();

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/process", async (req, res) => {
    const response = await client.responses.create({
        model: "gpt-4.1-nano",
        input: "Extract the calendar events from the following text: SPCH 11100 Tue/Thurs 2pm-3:15pm; ANTH 20100 Mon/Wed 12:30 to 1:45pm; CSC 10300 Tue/Thurs 11 to 11:50am and Fri 11 to 12:40pm; MATH 34600 Tue/Thurs 9:30am - 10:45am; CSC 10400 Tue/Thurs 4 to 5:40pm and Fri 1 to 2:40pm"
    });

    console.log(`Response: ${response.output_text}`);
    res.json(response.output_text);
});


app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))
