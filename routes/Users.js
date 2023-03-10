const express = require("express");
const router = express.Router();
const controllers = require("../controllers/Users");

router.get("/get-user/:id", controllers.getUserById);
router.put("/update-user/:id", controllers.updateUserById);
router.delete("/delete-user/:id", controllers.deleteUserById);

module.exports = router;
