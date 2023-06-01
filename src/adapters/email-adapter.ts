import nodemailer from 'nodemailer';
import { settings } from '../settings';

export const emailAdapter = {
  async sendEmail(email: string, confirmationCode: string | null) {
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
      subject: 'BackEndIncubatorTest',
      html: `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
      <a href="https://incubator-back.vercel.app/auth/registration-confirmation?code=${confirmationCode}">complete registration</a>
      </p>`,
    });
  },
};
