const express = require('express');
const body_parser =require('body-parser');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const app = express().use(body_parser.json());

const PORT = process.env.PORT || 8800;


app.get('/', (req, res) => {
    res.send(`

      <!DOCTYPE html>
      <html>
        <head>
          <title>My Backend Server</title>
        </head>
        <body>
          <h1>Welcome to my backend server!</h1>
          <p>Backend server is running!</p>
        </body>
      </html>
    `);
});

app.listen(PORT, () => {
  console.log('Backend server is running!');
});




// app.post("/message", async (req, res) => {
//     const msg = req.body.message;
//     const response = await generateResponse(msg);
//     res.send({ response });
//   });