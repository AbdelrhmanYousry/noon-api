const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");

router.get("/posts", userCtrl.getPosts);
// router.post("/post", userCtrl.createPost);
router.put("/post", userCtrl.updatePost);

module.exports = router;
