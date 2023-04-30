const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require("./src/db/connect.js").connectDB;
const lineRouter = require("./src/routes/lineRoute.js").lineRouter;
const apiRouter = require("./src/routes/api.js").apiRouter;

const PORT = process.env.PORT || 8000;

// 以下の順番は変更不可
const app = express();
app.use(cors())
app.use('/line', lineRouter);
app.use(bodyParser.json());
app.use('/api/v1', apiRouter)

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