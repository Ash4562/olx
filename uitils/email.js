const nodeMailer = require("nodemailer")

const SendEmail = ({ to, subject, message, html }) => new Promise((resolve, reject) => {
    try {
        const transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.FROM_EMAIL,
                pass: process.env.EMAIL_PASS
            }
        })
        transport.sendMail({
            from: process.env.FROM_EMAIL,
            to,
            subject,
            text: message,
            html: message
        }, err => {
            if (err) {
                console.log(err)
                reject(false)
            } else {
                resolve("Email Send Sucess")
            }
        })
    } catch (error) {
        console.log(error)
        return reject(error.message)
    }
})

module.exports = SendEmail