const express = require('express');
const body_parser =require('body-parser');
const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const app = express().use(body_parser.json());
const cors = require('cors');


const token = process.env.TOKEN;
const mytoken=process.env.MYTOKEN;
const PORT = process.env.PORT || 8800;

app.use(
  cors({
    origin: [
      'http://localhost:3000',
    
    ],
    credentials: true,
  })
);



app.get("/webhook",(req,res)=>{
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let tokens = req.query["hub.verify_token"];

  

  if(mode && token){
      if(mode === "subscribe" && tokens === mytoken){
          res.status(200).send(challenge);
          console.log("reez is on")
      }else{
          res.status(400)
      }
  }

  
});

app.post("/webhook",async (req,res) =>{
  let body_param = req.body;
  console.log("posting")
  if(body_param.object){
      if(body_param.entry ){
              let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
              let from = body_param.entry[0].changes[0].value.messages[0].from;
              let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
              
         
             
              axios({
                  method:"POST",
                  url:"https://graph.facebook.com/v16.0/"+phone_no_id+"/messages?access_token="+token,
                  data:{
                      "messaging_product": "whatsapp",    
                      "recipient_type": "individual",
                      "to": from,
                      "type": "text",
                      "text": {
                          "preview_url": false,
                          "body": "bi"
                      },
                      headers:{
                          "Content-Type":"application/json"
                      }
                  }
              });
              res.sendStatus(200);
          }else{
              res.sendStatus(404);
          }
  }
})

app.post('/send-message', async (req, res) => {
  try {
    const { phone_no_id, from, text, accessToken } = req.body;

    const response = await axios.post(
      `https://graph.facebook.com/v16.0/${phone_no_id}/messages?access_token=${accessToken}`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: from,
        type: 'text',
        text: {
          preview_url: false,
          body: text,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if the Facebook Graph API request was successful
    if (response.status === 200) {
      res.sendStatus(200);
    } else {
      console.error('Facebook Graph API request failed:', response.statusText);
      res.sendStatus(500);
    }
  } catch (error) {
    console.error('Error handling Facebook Graph API request:', error);
    res.sendStatus(500);
  }
});

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