const express = require("express");
const router = express.Router();
const userController = require("../controllers.js/user.controllers");
const storage = require("../middlewares/multer.middleware");
const { authentication } = require("../middlewares/authentication.middleware");

router.route("/register").post(
    storage.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController?.registerUser
);

router.post("/login",userController?.loginUser);

router.use(authentication)
router.post("/logout",userController?.logout);

module.exports = router;
