const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send(
    {
      to: email,
      from: 'pavlenko91pavel@gmail.com',
      subject: 'Welcome to the Task app!',
      text: `Welcome to the app, ${name}! Let me know you get along with the app`,
    }
  ).catch(error => {
        console.log('some errors with mail.sending')
    });
};

const sendCancelEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: 'pavlenko91pavel@gmail.com',
      subject: 'Are you leaving us???',
      text: `Dear, ${name}! We are sorry, that you are leaving us! Farewell, friend! Waiting for new meetings :)`,
    })
    .catch((error) => {
      console.log('some errors with mail.sending');
    });
};

module.exports = { sendWelcomeEmail, sendCancelEmail };
