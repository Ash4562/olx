const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const { checkEmpty } = require("../uitils/checkEmpty")
const Admin = require("../models/Admin")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "All Feilds Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: "Provide Strong Password" })
    // }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })

    res.json({ message: "Register Success" })
})


exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields Required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invaid Email" })
    }
    const result = await Admin.findOne({ email })

    if (!result) {
        return res.status(401).json({
            message: process.env.NODE_ENV === "development" ?
                "Invalid Password" : "Invalid Credintials"
        })
    }

    const isVerify = await bcrypt.compare(password, result.password)

    if (!isVerify) {
        return res.status(400).json({
            message: process.env.NODE_ENV === "development" ?
                "Invalid Password" : "Invalid Credintials"
        })
    }
    const otp = Math.floor(10000 + Math.random() * 9000000)

})