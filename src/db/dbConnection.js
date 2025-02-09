const mongoose = require("mongoose");
const { DB_NAME } = require("../constants");
require("dotenv").config();

const dbConnection = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    console.log(
      `\nMongodb connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Mongodb connection error", error);
    process.exit(1);
  }
};

module.exports = dbConnection;
