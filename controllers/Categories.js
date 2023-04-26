const Category = require("../models/Category");

const getAllCategories = async (req, res) => {
  try {
    var categories = await Category.find()
      .then(async (onCategoriesFound) => {
        console.log("on categories found: ", onCategoriesFound);
        if (onCategoriesFound.length <= 0) {
          res.json({
            message: "No categories are available!",
            status: "404",
            categories: [],
            success: false,
          });
        } else {
          res.json({
            message: "categories are available!",
            status: "200",
            categories: onCategoriesFound,
            success: true,
          });
        }
      })
      .catch(async (onCategoriesFoundError) => {
        console.log("on categories found error: ", onCategoriesFoundError);
        res.json({
          message: "Something went wrong while getting all categories!",
          status: "400",
          categories: [],
        });
      });
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  getAllCategories,
};
