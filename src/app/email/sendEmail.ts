import nodemailer from "nodemailer";

export default async function sendEmail({
  userEmail,
  subject,
  html,
}: {
  userEmail: string;
  subject: string;
  html: string;
}): Promise<void> {
  try {
    const { EMAIL, EMAIL_PASSWORD } = process.env;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Campy" <${EMAIL}>`,
      to: userEmail,
      subject,
      html,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
