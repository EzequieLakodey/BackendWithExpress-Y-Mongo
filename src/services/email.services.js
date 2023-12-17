import nodemailer from 'nodemailer';
import { logger } from '../middlewares/logger.js';

class EmailService {
    async sendEmail(user) {
        logger.info('Sending email to: ', user.email);
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.NODE_MAILER_MAIL,
                pass: process.env.NODE_MAILER_PASS,
            },
        });
        let mailOptions = {
            from: process.env.NODE_MAILER_MAIL,
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

export const emailService = new EmailService();
