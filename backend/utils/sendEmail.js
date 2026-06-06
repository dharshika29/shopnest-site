import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    let transporter;

    // Use real email credentials if provided in .env, otherwise use testing service
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      let testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const message = {
      from: '"ShopNest Team" <noreply@shopnest.com>', // sender address
      to: options.email, // list of receivers
      subject: options.subject, // Subject line
      html: options.html, // html body
      ...(options.attachments && { attachments: options.attachments })
    };

    const info = await transporter.sendMail(message);

    console.log("Message sent: %s", info.messageId);
    
    let previewUrl = null;
    if (!process.env.SMTP_USER) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL: %s", previewUrl);
    }
    
    return previewUrl;
  } catch (error) {
    console.error("Error sending email: ", error);
    return null;
  }
};

export default sendEmail;
