const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // settings for mailtrap, for development purpose ONLY
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

module.exports = class Mail {
  constructor(user, subject, message) {
    this.adress = user.email;
    this.subject = subject;
    this.message = message;
  }

  async send() {
    const info = await transporter.sendMail({
      from: 'Admin" <admin@rhoopoe.com>', // sender address
      to: this.adress,
      subject: this.subject,
      text: this.message,
    });
    console.log('Message sent: ', info.messageId);
  }
};
