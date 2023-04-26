const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config({
  path: "./configs/config.env",
});

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

var session = require("express-session");

app.use(
  session({
    secret: "lpWuPrFHWw7ye6VtNfLS",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 50000 })
);

const authRoutes = require("./routes/Auth");
const newsRoutes = require("./routes/NewsArticle");
const usersRoutes = require("./routes/Users");
const emailRoutes = require("./routes/Email");
const parseRoutes = require("./routes/File");
const forgotPasswordRoutes = require("./routes/ForgotPassword");
const categoriesRoutes = require("./routes/Categories");

app.use(cors());

app.use(morgan("tiny"));

let PORT = process.env.PORT || 4000;
let DB_URL = process.env.DB_URL;

app.use("/api/users", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/file", parseRoutes);
app.use("/api/category", categoriesRoutes);

app.use("/api/forgot-password", forgotPasswordRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("NEWSY API is running on PORT: ", PORT);

    mongoose.set("strictQuery", true);

    mongoose.connect(DB_URL, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("NEWSY Database Connected Successfully!");
      }
    });
  }
});
