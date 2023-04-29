const dotenv = require('dotenv');
dotenv.config();

// Messaging APIを利用するための鍵を設定します。
const config = {
    channelSecret: process.env.CHANNEL_SECRET || '作成したBOTのチャネルシークレット',
    channelAccessToken: process.env.CHANEL_ACCESS_TOKEN || '作成したBOTのチャネルアクセストークン'
  };

module.exports.config = config;