const nodemailer = require("nodemailer");
require("dotenv").config();

const sendVerifyEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu correo electrónico",
      html: `
        <h1>¡Bienvenido a la aplicación!</h1>
        <p>Para continuar con el registro, haz clic en el siguiente enlace:</p>
        <a href="${process.env.BASE_URL}/api/account/verify-email?token=${token}">Verificar correo electrónico</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo electrónico enviado a ${email}: ${info.messageId}`);
  } catch (error) {
    console.error("Ocurrió un error al enviar el correo electrónico:", error);
  }
};

module.exports = { sendVerifyEmail };
