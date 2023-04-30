const express = require("express");
const apiRouter = express.Router();
const Conversation = require("../db/schema.js").Conversation;
const config = require("../config/config.js").config;
const line = require('@line/bot-sdk');
const client = new line.Client(config);

apiRouter.get('/', (req, res) => {
    Conversation.find()
        .then(patient => res.json(patient)) 
        .catch(err => res.status(400).json(`Error: ${err}`));
});
apiRouter.get('/patient/:id', (req, res) => {
    // 患者さんからのメッセージをゲットする
})
apiRouter.post('/sendMessage', (req, res) => {
    const userId = req.body.userId;
    const message = req.body.messages[0];
    // 患者さんにメッセージを送信し記録する
    client.pushMessage(userId, message)
        .then(() => {
            Conversation.findOne({userId: userId})
            .then(user => {
                if (!user) {
                  console.log('User not found');
                  return;
                }
          
                const sendMessage = user.sendMessage || [];
                sendMessage.push(message.text);
                user.sendMessage = sendMessage;
          
                return user.save();
              })
              .then(response => {
                res.json(response);
              })
              .catch(err => res.status(400).json(`Error: ${err}`));
            })

});

apiRouter.post('/sendMovieMessage', (req, res) => {
    const { userId, messages } = req.body;
  
    client.pushMessage(userId, messages)
      .then(() => {
        console.log(messages);
        return Conversation.findOne({ userId: userId });
      })
      .then(user => {
        if (!user) {
          console.log('User not found');
          return;
        }
  
        const storingData = {
          'sendMovieURL': messages[0].text,
          'movieMessage': messages[1].text
        };
  
        console.log(storingData);
  
        const recommendMovie = user.recommendMovie || [];
        recommendMovie.push(storingData);
  
        user.recommendMovie = recommendMovie;
        return user.save();
      })
      .then(response => {
        res.json(response);
      })
      .catch(err => res.status(400).json(`Error: ${err}`));
  });
  
  

module.exports.apiRouter = apiRouter;