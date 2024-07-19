const { registerAdmin, loginAdmin,  verifyOTP,  } = require("../Controller/authController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin)
      .post("/login-admin", loginAdmin)
      .post("/verify-otp", verifyOTP)

module.exports = router;
