const nodemailer = require('nodemailer');

const createTransporter = async () => {
    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
};

const sendMail = async (to, subject, html) => {
    try {
        const transporter = await createTransporter();
        const info = await transporter.sendMail({
            from: '"LMS Admin" <admin@lms.local>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

module.exports = { sendMail };
