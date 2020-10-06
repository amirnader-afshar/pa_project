const express = require("express");

const productController = require("../controllers/productController");
const { authenticate } = require("../middleware/authenticate");

const router = express.Router();

router.post("/products", authenticate, productController.products);
router.get("/products/:productid&:page?", authenticate, productController.getproduct); 