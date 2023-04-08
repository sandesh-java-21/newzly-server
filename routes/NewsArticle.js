const express = require("express");
const router = express.Router();
const controllers = require("../controllers/NewsArticle");

router.post("/create-news", controllers.createNewsArticle);

router.get("/all-news-articles", controllers.getAllNewsArticles);

router.get(
  "/category-based-news-articles/:category_id",
  controllers.getNewsArticlesByCategoryId
);

router.patch("/like-news-article/:newsArticleId", controllers.likeNewsArticle);

router.patch(
  "/dis-like-news-article/:newsArticleId",
  controllers.disLikeNewsArticle
);

module.exports = router;
