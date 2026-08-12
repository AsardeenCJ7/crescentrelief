import nodemailer from "nodemailer";

/**
 * Creates a Nodemailer transporter from environment variables.
 *
 * Supported SMTP providers in .env:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS
 *
 * For Gmail:
 *   SMTP_HOST=smtp.gmail.com
 *   SMTP_PORT=465
 *   SMTP_SECURE=true
 *   SMTP_USER=your@gmail.com
 *   SMTP_PASS=your_app_password   (16-char App Password from Google Account Security)
 *
 * For Mailtrap (dev/test):
 *   SMTP_HOST=sandbox.smtp.mailtrap.io
 *   SMTP_PORT=587
 *   SMTP_SECURE=false
 *   SMTP_USER=your_mailtrap_username
 *   SMTP_PASS=your_mailtrap_password
 *
 * For Outlook/Hotmail:
 *   SMTP_HOST=smtp-mail.outlook.com
 *   SMTP_PORT=587
 *   SMTP_SECURE=false
 *   SMTP_USER=your@outlook.com
 *   SMTP_PASS=your_password
 *
 * For SendGrid:
 *   SMTP_HOST=smtp.sendgrid.net
 *   SMTP_PORT=587
 *   SMTP_SECURE=false
 *   SMTP_USER=apikey
 *   SMTP_PASS=your_sendgrid_api_key
 */

const createTransporter = () => {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      // Allow self-signed certs in dev
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });
};

/**
 * Send an email
 * @param {{ email: string, subject: string, message: string, html?: string }} options
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  // Verify connection in development mode
  if (process.env.NODE_ENV === "development") {
    try {
      await transporter.verify();
      console.log("[SMTP] Connection verified successfully.");
    } catch (err) {
      console.warn("[SMTP] Connection verification failed (email not sent):", err.message);
      // Don't throw — let the app continue even if SMTP isn't configured
      return;
    }
  }

  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "Crescent Relief"}" <${process.env.SMTP_FROM || "no-reply@crescentrelief.org"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html && { html: options.html }),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[SMTP] Email sent to ${options.email} — Message ID: ${info.messageId}`);
  return info;
};

export default sendEmail;
