const cloudinary = require("cloudinary").v2;
const NewsArticle = require("../models/NewsArticle");

const createNewsArticle = async (req, res) => {
  try {
    var { author, title, description, location, image, category } = req.body;
    let modelImage = "";

    cloudinary.uploader.upload(image).then(async (result) => {
      modelImage = result.secure_url;
      var news = new NewsArticle({
        author,
        title,
        description,
        location,
        image: modelImage,
      });

      var savedNews = await news
        .save()
        .then((savedResult) => {
          res.status(200).json({
            status: "200",
            savedNews,
            message: "news article created successfully!",
          });
        })

        .catch((error) => {
          res.status(406).json({
            status: "406",
            message: "error occured",
            error: error,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      status: "500",
      catchedErrors: error,
    });
  }
};

const getAllNewsArticles = async (req, res) => {
  try {
    var allNewsArticles = await NewsArticle.find();
    if (allNewsArticles && allNewsArticles.length >= 0) {
      res.status(200).json({
        status: "200",
        message: "News Articles Found!",
        allNewsArticles: allNewsArticles,
      });
    } else {
      res.status(404).json({
        status: "404",
        message: "No News Articles Found",
        allNewsArticles: allNewsArticles,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createNewsArticle,
  getAllNewsArticles,
};
