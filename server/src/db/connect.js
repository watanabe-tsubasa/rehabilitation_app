const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url)
    .then(() => console.log('connected'))
    .catch((error) => console.error(error))
}

module.exports.connectDB = connectDB;