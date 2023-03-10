const User = require("../models/User");

const login = async (req, res) => {
  var { email_address, password } = req.body;
  var singleUser = await User.find({
    email_address: email_address,
    password: password,
  });

  try {
    if (singleUser && singleUser.length === 0) {
      var responseData = {
        message:
          "Invalid username or password! No user found for given email address and password.",
        status: "404",
        singleUser: singleUser[0],
      };

      res.status(404).json(responseData);
    } else {
      var responseData = {
        status: "200",
        message: "Login Successful!",
        email_address: singleUser[0].email_address,
        singleUser: singleUser[0],
      };
      res.json(responseData);
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const signUp = async (req, res) => {
  try {
    var { email_address, password, first_name, last_name, phone_no } = req.body;

    const user = new User({
      email_address: email_address,
      first_name: first_name,
      last_name: last_name,
      password: password,
      phone_no: phone_no,
    });
    let savedUser = await user
      .save()
      .then((resp) => {
        console.log(resp);
        res.status(201).json({
          status: "201",
          message: "New user registered!",
          savedUser: resp,
        });
      })

      .catch((error) => {
        console.log(error);
        var responseData = {
          status: "422",
          errors: error,
        };
        res.status(422).json(responseData);
      });
  } catch (error) {
    var responseData = {
      status: "500",
      message: "Internal Server Error",
    };
    res.status(500).json(responseData);
    console.log(error);
  }
};

module.exports = {
  login,
  signUp,
};
