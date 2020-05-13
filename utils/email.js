const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.user = user;
    this.to = user.email;
    this.from = `Anthony Acosta ${process.env.EMAIL_FROM}`;
    this.url = url;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.MAILTRAP_SERVER,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });
  }

  async sendEmail(template, subject) {
    const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
      firstName: this.user.name,
      url: this.url,
      subject
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html
    };

    await this.createTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.sendEmail(
      'resetPassword',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendWelcome() {
    await this.sendEmail('welcome', 'Welcome to the DevEnterprise family!');
  }
};
