const express = require('express');
const line = require('@line/bot-sdk');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require("./src/db/connect.js").connectDB;
// const Conversation = require("./src/db/schema.js").Conversation;
const handleEvent = require("./src/handle_line_event/handleEvent.js").handleEvent;
const config = require("./src/config/config.js").config;
const PORT = process.env.PORT || 8000;

const app = express();
app.get('/', (req, res) => res.send('Hello LINE BOT! (HTTP GET)'));
app.post('/webhook', line.middleware(config), (req, res) => {

  if (req.body.events.length === 0) {
    res.send('Hello LINE BOT! (HTTP POST)');
    console.log('検証イベントを受信しました！');
    return;
  } else {
    console.log('受信しました:', req.body.events);
  }

  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

const main = async () => {
  const url = process.env.MONGODB_URL;
  try {
    await connectDB(url);
    await app.listen(PORT, () => {
      console.log('server starts');
    })
  } catch (error) {
    console.log(error);
  }
}

main();