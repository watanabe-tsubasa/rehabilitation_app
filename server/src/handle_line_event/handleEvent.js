const line = require('@line/bot-sdk');
const Conversation = require("../db/schema.js").Conversation;
const config = require("../config/config.js").config;
const client = new line.Client(config);

const handleEvent = async(event) => {
    if (event.type === 'follow' || (event.type === 'message' && event.message.type === 'text')) {
        const userId = event.source.userId;
        if (event.type === 'follow') {
            console.log('follow');
            const profile = await client.getProfile(userId)
            const displayName = profile.displayName;
            try {
                const isExist = await Conversation.findOne({userId: userId});
                if(isExist){
                    console.log('found');
                    console.log(isExist);
                } else{
                    console.log('not found');
                    console.log(isExist);
                    if(!isExist) {
                        // データベースへの登録
                        await Conversation.create(
                            {
                                userId: userId,
                                userName: displayName,
                                mainTherapist: 'is_not_set'
                            }
                        );
                        console.log('added to database');
                        return client.pushMessage(userId, {
                            type: 'text', // テキストメッセージ
                            text: '初めまして。これからリハビリ頑張っていきましょう。'
                        })
                    }
                }
            }catch(error) {
                console.log(error);
            }
        }
    
        if (event.type === 'message') {
            // 患者さんからのメッセージを取得
            const res = await Conversation.findOne(
                {userId: userId}
            )
            // 患者さんからのメッセージはデータベースに保存
            await Conversation.findOneAndUpdate(
                {userId: userId},
                {sendMessage:[...res.sendMessage, event.message.text]})
            return client.replyMessage(event.replyToken, {
                type: 'text', // テキストメッセージ
                text: '担当理学療法士にメッセージを送りました。'
            });
        }
    } else {
        return Promise.resolve(null);
    }
}

module.exports.handleEvent = handleEvent;