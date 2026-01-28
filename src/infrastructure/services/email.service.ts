import nodemailer from 'nodemailer';
import { Logger } from '@/core/logger/logger';
import { env } from '@/core/config/env';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      secure: env.SMTP_PORT === '465',
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      }
    });
  }

  async sendVerificationEmail(email: string, code: string) {
    const verificationLink = `${env.APP_URL}/auth/verify?code=${code}`;

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM,
        to: email,
        subject: 'Verify your account',
        html: `<h1>Welcome!</h1><p>Please verify your account by clicking <a href="${verificationLink}">here</a>.</p><p>Code: ${code}</p>`
      });
      Logger.info(`Verification email sent to ${email}`);
    } catch (error) {
      Logger.error(`Failed to send email to ${email}`, error);
      throw error;
    }
  }
}
