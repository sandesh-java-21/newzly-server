const express = require("express");
const router = express.Router();
const controllers = require("../controllers/NewsArticle");

router.post("/create-news", controllers.createNewsArticle);

router.get("/all-news-articles", controllers.getAllNewsArticles);

module.exports = router;
