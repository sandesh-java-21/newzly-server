const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

const getUserById = async (req, res) => {
  try {
    var _id = req.params.id;
    console.log(_id);
    if (_id !== undefined && _id != null) {
      var users = await User.find({ _id: _id });
    } else {
      var users = await User.find();
    }
    if (!users.length <= 0) {
      res.json({
        status: "200",
        users: users,
        message: "user found with provided id",
      });
    } else {
      res.json({
        status: "404",
        message: "user not found with provided id",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "500",
      message: "internal server error",
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    var { email_address, first_name, last_name, phone_no } = req.body;

    var filter = { _id: req.params.id };
    var update = {
      first_name: first_name,
      last_name: last_name,
      email_address: email_address,
      phone_no: phone_no,
    };

    var searchedUser = await User.findByIdAndUpdate(filter, update, {
      new: true,
      rawResult: true,
    })
      .then(function (result) {
        console.log(result.value);
        if (result.value === null) {
          var responseData = {
            status: "404",
            message: "No user found with provided id",
          };
          res.status(404).json(responseData);
        } else {
          if (result.lastErrorObject.updatedExisting === true) {
            var responseData = {
              status: "200",
              message: "user details updated successfully!",
              updatedDocument: result.value,
            };
            res.status(200).json(responseData);
          } else {
            var responseData = {
              status: "202",
              message: "Student details not updated yet!",
              token: token,
            };
            res.status(202).json(responseData);
          }
        }
      })
      .catch(function (err) {
        var responseData = {
          error: err,
          message: "Error Occured!",
          status: "400",
        };
        res.status(400).json(responseData);
      });
  } catch (error) {
    res.status(500).json({
      error: error,
      status: "500",
      message: "Internal server error!",
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    var userId = req.params.id;
    var filter = { _id: userId };

    var searchedUser = await User.findOneAndDelete(filter, {
      rawResult: true,
    })
      .then(function (result) {
        if (result.value === null) {
          res.status(404).json({
            status: "404",
            message: "No user found with provided id",
          });
        } else {
          if (result.lastErrorObject.n >= 1) {
            res.status(200).json({
              status: "200",
              message: "User deleted successfully",
            });
          }
        }
      })
      .catch(function (err) {
        var responseData = {
          error: err,
          status: "500",
          message: "Internal Server Error!",
        };
        res.status(500).json(responseData);
      });
  } catch (error) {
    res.send(error);
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    var user_id = req.params.user_id;

    var { image } = req.body;

    if (!user_id || user_id === "") {
      res.json({
        message: "Required field are empty!",
        status: "400",
      });
    } else {
      var user = await User.findById(user_id)
        .then(async (onUserFound) => {
          console.log("on user found: ", onUserFound);

          cloudinary.uploader
            .upload(`data:image/jpeg;base64,${image}`, {
              folder: "user-profiles",
            })
            .then(async (onImageUploadCloudinary) => {
              console.log(
                "on image upload cloudinary: ",
                onImageUploadCloudinary
              );

              var public_id = onImageUploadCloudinary.public_idl;
              var imageUrl = onImageUploadCloudinary.secure_url;

              var filter = {
                _id: onUserFound._id,
              };

              var updateData = {
                image: {
                  url: imageUrl,
                  public_id: public_id,
                },
              };

              var updated = await User.findByIdAndUpdate(filter, updateData, {
                new: true,
              })
                .then(async (onUserProfileUpdate) => {
                  console.log("on user profile update: ", onUserProfileUpdate);
                  res.json({
                    message: "User Profile Uploaded!",
                    status: "200",
                    updatedUser: onUserProfileUpdate,
                    profileNew: onUserProfileUpdate.profile_image,
                  });
                })
                .catch(async (onUserProfileUpdateError) => {
                  console.log(
                    "on user profile update error: ",
                    onUserProfileUpdateError
                  );
                  res.json({
                    message:
                      "Something went wrong while updating profile image!",
                    status: "400",
                    error: onUserProfileUpdateError,
                  });
                });
            })
            .catch(async (onImageUploadCloudinaryError) => {
              console.log(
                "on image upload cloudinary error: ",
                onImageUploadCloudinaryError
              );
              res.json({
                message:
                  "Something went wrong while uploading profile picture!",
                status: "400",
                error: onImageUploadCloudinaryError,
              });
            });
        })
        .catch(async (onUserFoundError) => {
          console.log("on user found error: ", onUserFoundError);
          res.json({
            message: "User Not Found!",
            status: "404",
          });
        });
    }
  } catch (error) {
    var responseData = {
      error: error,
      status: "500",
      message: "Internal Server Error!",
    };

    res.json(responseData);
  }
};

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  updateProfilePicture,
};
