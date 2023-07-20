const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  // settings for mailtrap, for development purpose ONLY
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    // pls don't spam my mailtrap inbox
    user: '38f4f8720c972f',
    pass: '2562297c50714a',
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
    console.log('Message sent: %s', info.messageId);
  }
};
