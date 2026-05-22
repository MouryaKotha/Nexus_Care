import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Define email options
    const mailOptions = {
        from: `Nexus Care <no-reply@nexuscare.com>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
