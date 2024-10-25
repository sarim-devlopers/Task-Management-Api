const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = { from: process.env.EMAIL_USERNAME, to, subject, text, html };
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
  }
};

module.exports = {
  sendTaskReminder: async (to, task) => sendEmail(
    to, `Reminder: Task "${task.title}"`, `Reminder: Task "${task.title}" is due soon.`
  ),
  sendOverdueNotification: async (to, task) => sendEmail(
    to, `Overdue: Task "${task.title}"`, `The task "${task.title}" is overdue.`
  ),
};
