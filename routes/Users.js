const express = require("express");
const router = express.Router();
const controllers = require("../controllers/Users");

router.get("/get-user/:id", controllers.getUserById);
router.put("/update-user/:id", controllers.updateUserById);
router.delete("/delete-user/:id", controllers.deleteUserById);
router.patch(
  "/upload-profile-image/:user_id",
  controllers.updateProfilePicture
);

router.patch(
  "/make-user-as-journalist/:user_id",
  controllers.authenticateUserAsJournalist
);

module.exports = router;
