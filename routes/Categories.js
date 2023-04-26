const express = require("express");
const router = express.Router();

const categoriesControllers = require("../controllers/Categories");

router.get("/get-all-categories", categoriesControllers.getAllCategories);

module.exports = router;
