import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'forcesofthesky@gmail.com',
        pass: 'wiub pyrz ryty wnsn',
    },
});

let mailOptions = {
    from: 'forcesofthesky@gmail.com',
    to: 'ela.webdeveloper@gmail.com',
    subject: 'Nodemailer Test',
    text: 'This is a test email sent by nodemailer.',
    html: `
    <div>
    <h1>This is a test email sent by nodemailer.</h1>
    <img src="cid:logo"/>
    </div>
    `,
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
