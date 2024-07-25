const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../uitils/checkEmpty")
const Admin = require("../models/Admin")
const SendEmail = require("../uitils/email")
const User = require("../models/User")

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

    await Admin.findByIdAndUpdate(result._id, { otp })
    await SendEmail({
        to: email,
        subject: "Login OTP",
        message: `
        <h1>Do Not Share Your Account Otp</h1>
        <p>Your Login ${otp}</p>`
    })
    res.json({ message: "Credentials Verify Success.Email Send To Your Register Email" })

})

exports.verifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
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
    if (otp !== result.otp) {
        return res.status(401).json({ message: "Invaid OTP" })

    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    // JWT
    res.cookie("admin", token, {
        maxAge: 864000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    //  cookie 
    res.json({
        message: "OTP Verify Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
        }
    })
})

exports.logout = asyncHandler(async (rea, res) => {

})

exports.regiterUser = asyncHandler(async (rea, res) => {
    const { name, mobile, email, password, cpassword } = req.body
    const { errer, isError } = checkEmpty({
        name, mobile, email, password, cpassword
    })
    if (isError) {
        return res.status(400).json({ message: "All fields required".error })
    }
    if (!validator.isEmail(email)) { return res.status(400).json({ message: "Invalid email" }) }
    if (!validator.isMobilePhone(mobile, "en-IN")) { return res.status(400).json({ message: "Invalid mobile" }) }
    if (!validator.isStrongPassword(password)) { return res.status(400).json({ message: "Invalid password" }) }
    if (!validator.isStrongPassword(cpassword)) { return res.status(400).json({ message: "Invalid cpassword" }) }
    if (password !== cpassword) { return res.status(400).json({ message: "password do match" }) }
    const result=await User.findOne({email})
    if(!result){
        return res.status(400).json({ message: "alread hane this email" })
    }
    const hash = await bcrypt.hash(password, 10)
    await User.create({ name, mobile, email, password: hash })
    res.json({ message: "user Register Success" })
})

exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const { isError, error } = checkEmpty({ email, password })

    if (isError) { return res.status(400).json({ message: "All Fields Required" }) }

    const result = await User.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email Not Found" })
    }
    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "Password Do Not Match" })
    }

    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "180d" })

    res.cookie("user", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expiresIn: 1000 * 60 * 60 * 24 * 180
    })


    res.json({ message: "User Rgister Success" })

})

exports.logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("User")
    res.json({ message: "User Logout Success" })
})