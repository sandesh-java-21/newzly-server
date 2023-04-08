const User = require("../models/User");
const OTP = require("../models/OTP");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const checkUserEmail = async (req, res) => {
  try {
    var { email } = req.body;
    console.log(email);
    if (!email || email === "") {
      res.json({
        message: "Please provide email address!",
        status: "400",
      });
    } else {
      var searchedUser = await User.find({
        email_address: email,
      });

      if (!searchedUser || searchedUser.length <= 0) {
        res.json({
          message: "No user found with provided email address!",
          status: "404",
        });
      } else {
        res.json({
          success: true,
          message: "User found with provided email address!",
          user: searchedUser[0],
          email: searchedUser[0].email_address,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const sendForgotPasswordOtpEmail = async (req, res) => {
  try {
    var email = req.params.email;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: "2525",
      auth: {
        user: "sandeshbatrasn@gmail.com",
        pass: "rwivszofngspicax",
      },
    });

    // Generate a 4-digit random number
    const otpCode = Math.floor(Math.random() * 9000) + 1000;

    console.log(otpCode);

    let mailOptions = {
      from: "NO-REPLY sandeshbatrasn@gmail.com",
      to: email,
      subject: "Forgot Password OTP",
      html: `<h1>${otpCode}</h1>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res, send(error);
      } else {
        req.session.code = otpCode;
        var otpObj = new OTP({
          email: email,
          otp_code: otpCode,
        });

        otpObj.save();

        res.send("Forgot Password OTP Email Sent");
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    var email_address = req.params.email_address;
    var { otp_code } = req.body;

    if (!email_address || email_address === "") {
      res.json({
        message: "Email address not sent!",
        status: "400",
      });
    } else {
      var otp = await OTP.findOne({
        email: email_address,
      })
        .then(async (onOtpFound) => {
          var otpObj = onOtpFound;

          if (otpObj.email === email_address && otpObj.otp_code === otp_code) {
            var deletedOtp = await OTP.findOneAndDelete({
              email: email_address,
            })
              .then(async (onOtpDelete) => {
                res.json({
                  message: "OTP Verified!",
                  status: "200",
                });
              })
              .catch((onOtpNotDelete) => {
                res.json({
                  message: "OTP Not Verified!",
                  status: "400",
                  error: onOtpNotDelete,
                });
              });
          } else {
            res.json({
              message: "OTP Not Verified!",
              status: "400",
            });
          }
        })
        .catch((onOtpNotFound) => {
          res.json({
            message: "OTP not sent yet or has been expired!",
            status: "404",
            error: onOtpNotFound,
          });
        });
    }
  } catch (error) {
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    var email_address = req.params.email_address;

    var { password, confirm_password } = req.body;

    if (!password || !confirm_password) {
      res.json({
        success: false,
        message: "Required fields are empty!",
      });
    } else {
      if (
        password === "" ||
        confirm_password === "" ||
        password === " " ||
        confirm_password === " "
      ) {
        res.json({
          success: false,
          message: "Password and confirm password can not contain space!",
        });
      } else {
        if (password == confirm_password) {
          var filter = {
            email_address: email_address,
          };

          var salt = bcrypt.genSaltSync(10);
          var encryptPassword = bcrypt.hashSync(password, salt);
          console.log("Encrypted: ", encryptPassword);

          var update = {
            password: encryptPassword,
          };
          var searchedUser = await User.findOneAndUpdate(filter, update, {
            new: true,
          })
            .then((result) => {
              res.json({
                result: result,
                message: "Password Updated Successfully!",
                status: "200",
                success: true,
              });
            })

            .catch((error) => {
              res.json({
                error,
                message: "Can not update password",
                status: "400",
                success: false,
              });
            });
        } else {
          res.send("Password and confirm password should be same!");
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Internal server error!",
      status: "500",
      error,
    });
  }
};

module.exports = {
  checkUserEmail,
  sendForgotPasswordOtpEmail,
  verifyForgotPasswordOtp,
  updatePassword,
};
