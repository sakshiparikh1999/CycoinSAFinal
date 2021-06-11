const nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

async function mail(to_mail, mail_subject, mail_content) {
  const mail_footer = '<p>Thanks & Regards,<br/>Team HU</p>';

  const mailOptions = {
    to: to_mail,
   from: 'amantotla@questglt.org',
    //form:'customerservice@huwallet.info',
    subject: mail_subject,
    html: mail_content + mail_footer
  };

  const Transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    // port: 465,
    host: 'smtp.gmail.com',
    auth: {
      user: 'amantotla@questglt.org',
     // user:'customerservice@huwallet.info',
      pass: 'Aman@6002'
      //pass:'2-22-21hu'
    }
    // tls: {
    //   rejectUnauthorized: true
    // }
  }));

  return new Promise((resolve, reject) => {
    Transport.sendMail(mailOptions, function (err, result) {

      if (err) {
        console.log("Mail sending", err);
        reject(0);
      }
      else {
        // console.log('Mail Sent------------',result);
        resolve(1)
      }
    })
  })
}

async function run_mail(mail_id,mail_subject, mail_content) {
  const res = await mail(mail_id, mail_subject, mail_content)
  return res
}

module.exports = {
  run_mail,
}
