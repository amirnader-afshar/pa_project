const express = require("express");

const adminController = require("../controllers/adminController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/login", adminController.login);
router.post("/users",authenticate, adminController.users);
router.delete("/logout",authenticate, adminController.logout )

module.exports = router;
