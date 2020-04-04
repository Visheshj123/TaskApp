

const sgMail = require('@sendgrid/mail')
const sendGridApiKey = process.env.SENDGRIDAPIKEY


//set api key for sendgrid obejct
sgMail.setApiKey(sendGridApiKey)

const sendWelcomeEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'visheshj123@gmail.com',
    subject: `Welcome ${name}`,
    text: "I can't wait to eat pickle juice"
  }

   sgMail.send(msg)

}


const cancelEmail = (email, name) => {
  const msg = {
    to: email,
    from: 'visheshj123@gmail.com',
    subject: `Bye bye ${name}`,
    text: 'Hate to see you go'
  }
  sgMail.send(msg)
}

module.exports = {
  sendWelcomeEmail,
  cancelEmail
}
