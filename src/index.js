const express = require("express");
require("dotenv").config({ path: "./src/.env" });
const dbConnection = require("./db/dbConnection");

const app = express();
dbConnection();

app.listen(process.env.PORT , () => {
  console.log(`🚀 Sever is running on port ${process.env.PORT}`);
});
