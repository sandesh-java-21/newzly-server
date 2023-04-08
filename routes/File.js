const { json } = require("express");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

router.get("/make", async (req, res) => {
  try {
    var data = fs.readFileSync("api-data.json").toString();
    data = JSON.parse(data);
    var articles = data.articles;

    articles.forEach((element) => {
      delete element.source;
      console.log(element.source);
      element.description = element.description;
      element.image = element.urlToImage;
      delete element.urlToImage;
      delete element.publishedAt;
      delete element.url;
    });

    articles = articles;

    res.json(articles);
  } catch (error) {
    res.send(error);
  }
});

var Article = require("../models/NewsArticle");

router.post("/import-data", async (req, res) => {
  try {
    var data = fs.readFileSync("data.json").toString();
    data = JSON.parse(data);
    var saved = Article.insertMany(data);
    res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.post("/retrieve-image", async (req, res) => {
  try {
    var { image } = req.body;
    cloudinary.uploader
      .upload(`data:image/jpeg;base64,${image}`)
      .then(async (result) => {
        res.send(result.secure_url);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
