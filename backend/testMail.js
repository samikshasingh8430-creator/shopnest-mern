require("dotenv").config();

const transporter = require("./config/mail");

async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "ShopNest Nodemailer Test",
            text: "Hello! Nodemailer is working successfully."
        });

        console.log("Email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
}

sendTestEmail();