
import dotenv from "dotenv";
import nodemailer from 'nodemailer'

dotenv.config()
export class MailService {
    transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.yandex.ru",
            port: process.env.SMTP_PORT,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: process.env.SMTP_POST,
                pass: process.env.SMTP_POSTPASS,
            },
        })
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_POST,
            to,
            subject: "Активация аккаунта для" + process.env.API_URL,
            text: "",
            html: `
            <div>
                <h1>Активируй аккаунт по ссылке</h1>
                <a href="${link}"> ссылка для активации ${link}</a>
            </div>
            
            `
        })
    }
}