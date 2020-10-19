const express = require("express");

const commentController = require("../controllers/commentController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/comments",authenticate,  commentController.comment);
router.get("/comments",authenticate,  commentController.getcomment); 
router.get("/commentCount",authenticate,  commentController.getcommentcount); 


module.exports = router;