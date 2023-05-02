import nodemailer from 'nodemailer';
import { settings } from '../settings';

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.MY_EMAIL,
        pass: settings.EMAIL_PASS,
      },
    });
    return await transport.sendMail({
      from: 'Ricky',
      to: email,
      subject: subject,
      html: message,
    });
  },
};
