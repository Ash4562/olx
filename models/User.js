const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default:"https://res.cloudinary.com/dwxnkedc1/image/upload/v1721291323/WhatsApp_Image_2024-03-28_at_10.25.23_4604f42c_hgg2ie.jpg"

    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: false
    },
    code: {
        type: String,

    },
    active: {
        type: Boolean,
        default: true
    },
    mobile: {
        type: String,
        required: true
    }
}, { timestamps: ture })
module.exports = mongoose.model("user", userSchema)