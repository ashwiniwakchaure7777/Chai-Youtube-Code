require("dotenv").config({ path: "./src/.env" });
const app = require("./app");
const dbConnection = require("./db/dbConnection");

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8090, () => {
      console.log(`Server is running on port ${process.env.PORT} 🚀`);
      app.on("error", (error) => {
        console.log("App error", error);
        throw error;
      });
    });
  })
  .catch((error) => {
    console.error("Mongodb connection failed", error);
  });
