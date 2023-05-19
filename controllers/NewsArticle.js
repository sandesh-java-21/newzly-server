const cloudinary = require("cloudinary").v2;
const NewsArticle = require("../models/NewsArticle");
const User = require("../models/User");

const createNewsArticle = async (req, res) => {
  try {
    var { author, title, description, location, image, category } = req.body;
    console.log("data: ", author, title, description, location, category);
    let modelImage = "";

    cloudinary.uploader
      .upload(`data:image/jpeg;base64,${image}`, {
        folder: "news",
      })
      .then(async (result) => {
        modelImage = result.secure_url;
        var news = new NewsArticle({
          author,
          title,
          description,
          location: location !== "" ? location : "",
          image: modelImage,
          category: category,
        });

        var savedNews = await news
          .save()
          .then((savedResult) => {
            res.status(200).json({
              status: "200",
              savedNews: savedResult,
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
      })
      .catch(async (onError) => {
        console.log("jygsdfjgfdsjhgfds", onError);
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
    var allNewsArticles = await NewsArticle.find()
      .populate("category", {
        name: 1,
      })
      .sort({ _id: -1 })
      .limit(50);
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

const likeNewsArticle = async (req, res) => {
  try {
    var newsArticleId = req.params.newsArticleId;

    if (!newsArticleId || newsArticleId === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var newsArticle = await NewsArticle.findById({
        _id: newsArticleId,
      })
        .then(async (onNewsArticleFound) => {
          console.log("on news article found: ", onNewsArticleFound);
          var newsArticleObj = onNewsArticleFound;

          var author = await User.findById({
            _id: newsArticleObj.author,
          })
            .then(async (onAuthorFound) => {
              var authorObj = onAuthorFound;
              console.log("on news author found: ", onAuthorFound);

              var filter = {
                _id: authorObj._id,
              };

              var coinUpdateData = {
                total_coins: authorObj.total_coins + 1,
              };

              var updatedAuthor = await User.findByIdAndUpdate(
                filter,
                coinUpdateData,
                {
                  new: true,
                }
              )
                .then(async (onCoinsUpdate) => {
                  console.log("on coins update: ", onCoinsUpdate);

                  var filter = {
                    _id: newsArticleObj._id,
                  };

                  var newsArticleCoinUpdateData = {
                    total_likes: newsArticleObj.total_likes + 1,
                  };

                  var updatedNews = await NewsArticle.findByIdAndUpdate(
                    filter,
                    newsArticleCoinUpdateData,
                    {
                      new: true,
                    }
                  )
                    .then(async (onNewsCoinUpdate) => {
                      console.log("on news coin update: ", onNewsCoinUpdate);
                      res.json({
                        message: "You Liked This Newz!",
                        status: "200",
                        updatedNews: onNewsCoinUpdate,
                        updated_likes: onNewsCoinUpdate.total_likes,
                      });
                    })
                    .catch(async (onNewsCoinUpdateError) => {
                      console.log(
                        "on news coin update error: ",
                        onNewsCoinUpdateError
                      );
                      res.json({
                        message: "Something went wrong!",
                        status: "400",
                        error: onNewsCoinUpdateError,
                      });
                    });
                })
                .catch(async (onUserCoinsNotUpdate) => {
                  console.log(
                    "on user coins not update: ",
                    onUserCoinsNotUpdate
                  );
                  res.json({
                    message: "Something went wrong!",
                    status: "400",
                    error: onUserCoinsNotUpdate,
                  });
                });
            })
            .catch(async (onAuthorFoundError) => {
              console.log("on author found error: ", onAuthorFoundError);
              res.json({
                onAuthorFoundError,
              });
            });
        })
        .catch(async (onNewsArticleNotFound) => {
          console.log("on news article not found: ", onNewsArticleNotFound);
          res.json({
            message: "News article not found!",
            status: "404",
            error: onNewsArticleNotFound,
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const disLikeNewsArticle = async (req, res) => {
  try {
    var newsArticleId = req.params.newsArticleId;

    if (!newsArticleId || newsArticleId === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var newsArticle = await NewsArticle.findById({
        _id: newsArticleId,
      })
        .then(async (onNewsArticleFound) => {
          console.log("on news article found: ", onNewsArticleFound);
          var newsArticleObj = onNewsArticleFound;

          var author = await User.findById({
            _id: newsArticleObj.author,
          }).then(async (onAuthorFound) => {
            var authorObj = onAuthorFound;
            console.log("on news author found: ", onAuthorFound);

            var filter = {
              _id: authorObj._id,
            };

            var coinUpdateData = {
              total_coins: authorObj.total_coins,
            };

            var updatedAuthor = await User.findByIdAndUpdate(
              filter,
              coinUpdateData,
              {
                new: true,
              }
            )
              .then(async (onCoinsUpdate) => {
                console.log("on coins update: ", onCoinsUpdate);

                var filter = {
                  _id: newsArticleObj._id,
                };

                var newsArticleCoinUpdateData = {
                  total_dislikes: newsArticleObj.total_dislikes + 1,
                };

                var updatedNews = await NewsArticle.findByIdAndUpdate(
                  filter,
                  newsArticleCoinUpdateData,
                  {
                    new: true,
                  }
                )
                  .then(async (onNewsCoinUpdate) => {
                    console.log("on news coin update: ", onNewsCoinUpdate);
                    res.json({
                      message: "You Disliked This Newz!",
                      status: "200",
                      updatedNews: onNewsCoinUpdate,
                      updated_likes: onNewsCoinUpdate.total_likes,
                    });
                  })
                  .catch(async (onNewsCoinUpdateError) => {
                    console.log(
                      "on news coin update error: ",
                      onNewsCoinUpdateError
                    );
                    res.json({
                      message: "Something went wrong!",
                      status: "400",
                      error: onNewsCoinUpdateError,
                    });
                  });
              })
              .catch(async (onUserCoinsNotUpdate) => {
                console.log("on user coins not update: ", onUserCoinsNotUpdate);
                res.json({
                  message: "Something went wrong!",
                  status: "400",
                  error: onUserCoinsNotUpdate,
                });
              });
          });
        })
        .catch(async (onNewsArticleNotFound) => {
          console.log("on news article not found: ", onNewsArticleNotFound);
          res.json({
            message: "News article not found!",
            status: "404",
            error: onNewsArticleNotFound,
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const getNewsArticlesByCategoryId = async (req, res) => {
  try {
    var categoryId = req.params.category_id;

    if (!categoryId || categoryId === "") {
      res.json({
        message: "Please provide a category id!",
        status: "404",
      });
    } else {
      var categoryBasedNewsArticles = await NewsArticle.find({
        category: categoryId,
      })
        .then(async (onNewsFound) => {
          console.log("category based news are: ", onNewsFound);

          res.json({
            message: "Category based news found!",
            status: "200",
            newsArticles: onNewsFound,
          });
        })
        .catch(async (onNoNewsFound) => {
          console.log("on no news found: ", onNoNewsFound);
          res.json({
            message: "No News Found!",
            status: "404",
            newsArticles: onNoNewsFound,
            error: onNoNewsFound,
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const updateNewsArticle = async (req, res) => {
  try {
    var news_article_id = req.params.news_article_id;
    var { title, description, category } = req.body;

    if (!news_article_id || news_article_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var news = await NewsArticle.findById(news_article_id)
        .then(async (onNewsFound) => {
          console.log("on news found: ", onNewsFound);
          var filter = {
            _id: onNewsFound._id,
          };

          var updateData = {
            title,
            description,
            category,
          };

          var updated = await NewsArticle.findByIdAndUpdate(
            filter,
            updateData,
            {
              new: true,
            }
          )
            .then(async (onNewsUpdate) => {
              console.log("on news update: ", onNewsUpdate);
              res.json({
                message: "News Article Updated!",
                status: "200",
                updatedNews: onNewsUpdate,
              });
            })
            .catch(async (onNewsUpdateError) => {
              console.log("on news update error: ", onNewsUpdateError);
              res.json({
                message: "Something went wrong while updating news article!",
                status: "400",
              });
            });
        })
        .catch(async (onNewsFoundError) => {
          console.log("on news found error: ", onNewsFoundError);
          res.json({
            message: "News Article Not Found!",
            status: "404",
            newsArticle: null,
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

const deleteNewsArticleById = async (req, res) => {
  try {
    var news_article_id = req.params.news_article_id;

    if (!news_article_id || news_article_id === "") {
      res.json({
        message: "Required fields are empty!",
        status: "400",
      });
    } else {
      var deleted = await NewsArticle.findById(news_article_id)
        .then(async (onNewsArticleFound) => {
          console.log("on news article found: ", onNewsArticleFound);

          var deleted = await NewsArticle.findByIdAndDelete(
            onNewsArticleFound._id
          )
            .then(async (onNewsDelete) => {
              console.log("on news delete: ", onNewsDelete);
              res.json({
                message: "News Article Deleted!",
                status: "200",
              });
            })

            .catch(async (onNewsDeleteError) => {
              console.log("on news delete error: ", onNewsDeleteError);
              res.json({
                message: "Something went wrong while deleting news article!",
                status: "400",
              });
            });
        })
        .catch(async (onNewsArticleFoundError) => {
          console.log("on news article found error: ", onNewsArticleFoundError);
          res.json({
            message: "News Article Not Found!",
            status: "404",
          });
        });
    }
  } catch (error) {
    res.json({
      status: "500",
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = {
  createNewsArticle,
  getAllNewsArticles,
  likeNewsArticle,
  disLikeNewsArticle,
  getNewsArticlesByCategoryId,
  updateNewsArticle,
  deleteNewsArticleById,
};
