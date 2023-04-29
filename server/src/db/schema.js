const mongoose = require('mongoose');

const schemaData = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    mainTherapist: {
        type: String,
        required: true,
    },
    replyMessage: {
        type: Array,
        required: true,
    },
    sendMessage: {
        type: Array,
        required: true,
    },
    recommendMovie: {
        type:Array,
        required: true
    }
});

const Conversation = mongoose.model('Conversation', schemaData);

module.exports.Conversation = Conversation;