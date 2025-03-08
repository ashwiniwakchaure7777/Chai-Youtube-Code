const express = require("express");
const router = express.Router();
const userController = require("../controllers.js/user.controllers");
const storage = require("../middlewares/multer.middleware");

router.route("/register").post(
    storage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController?.registerUser
);

module.exports = router;
