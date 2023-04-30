const express = require("express");
const lineRouter = express.Router();
const handleEvent = require("../handle_line_event/handleEvent.js").handleEvent;
const config = require("../config/config.js").config;
const line = require('@line/bot-sdk');

lineRouter.get('/', (req, res) => res.send('Hello LINE BOT! (HTTP GET)'));
lineRouter.post('/webhook', line.middleware(config), (req, res) => {

  if (req.body.events.length === 0) {
    res.send('Hello LINE BOT! (HTTP POST)');
    console.log('検証イベントを受信しました！');
    return;
  } else {
    console.log('受信しました:', req.body.events);
  }

  Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));
});

module.exports.lineRouter = lineRouter;