const express = require("express");
const router = express.Router();

const forgotPasswordControllers = require("../controllers/ForgotPassword");

router.post("/check-user-email", forgotPasswordControllers.checkUserEmail);

router.post(
  "/send-forgot-password-otp-email/:email",
  forgotPasswordControllers.sendForgotPasswordOtpEmail
);

router.post(
  "/verify-forgot-password-otp/:email_address",
  forgotPasswordControllers.verifyForgotPasswordOtp
);

router.patch(
  "/update-pasword/:email_address",
  forgotPasswordControllers.updatePassword
);

module.exports = router;
