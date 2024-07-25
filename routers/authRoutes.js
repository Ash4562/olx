
const { registerAdmin, loginAdmin,  verifyOTP, loginUser, regiterUser, logoutUser,  } = require("../Controller/authController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin)
      .post("/login-admin", loginAdmin)
      .post("/verify-otp", verifyOTP)
// user
.post("/login-mobile-user",loginUser)
.post("/register-mobile-user",regiterUser)
.post("/logout-mobile-user",logoutUser)
module.exports = router;
