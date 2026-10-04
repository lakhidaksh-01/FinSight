import nodemailer from "nodemailer";
console.log("SMTP_HOST:", process.env.SMTP_HOST);
console.log("SMTP_PORT:", process.env.SMTP_PORT);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendPasswordResetOtp = async (email, otp) => {
  await transporter.sendMail({
    from: `"FinSight" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "FinSight Password Reset OTP",
    text: `Your FinSight password reset OTP is ${otp}. It will expire in 90 seconds.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2>FinSight Password Reset</h2>

        <p>We received a request to reset your FinSight password.</p>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing: 8px;">${otp}</h1>

        <p>
          This OTP is valid for <strong>90 seconds</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore
          this email.
        </p>
      </div>
    `
  });
};