import nodemailer from 'nodemailer';
import { logger } from '../middlewares/logger.js';

class EmailService {
    async sendEmail(user) {
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
            to: user.email,
            subject: 'Deletion account',
            html: `
     <div>
     <h1>Your account was deleted due to inactivity</h1>
     <img src="cid:logo"/>
     </div>
     `,
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    logger.error(
                        'An error occured while sending the mails:',
                        error
                    );
                    reject(error);
                } else {
                    logger.info('Email sent: ', +info.response);

                    resolve(info);
                }
            });
        });
    }
}

export default EmailService;
