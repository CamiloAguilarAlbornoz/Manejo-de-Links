const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'camiloaaguilara@gmail.com', // generated ethereal user
        pass: 'rbwyhiisfqiqxxee', // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('Ready to send emails');
});

module.exports = transporter;