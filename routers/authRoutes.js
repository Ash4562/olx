const { registerAdmin, loginAdmin } = require("../Controller/authController");
const router = require("express").Router();

router.post("/register-admin", registerAdmin)
      .post("/login-admin", loginAdmin);

module.exports = router;
