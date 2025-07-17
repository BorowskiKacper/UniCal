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
        input: "Write a one-sentence bedtime story about a unicorn."
    });

    console.log(`Response: ${response.output_text}`);
    res.json(response.output_text);
});


app.listen(PORT, () =>  console.log(`Server is running on port ${PORT}`))
