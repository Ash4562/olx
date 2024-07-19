const { registerAdmin } = require("../Controller/authController")

const router = require("express").Router()

router.post("/register-admin", registerAdmin)
module.exports = router