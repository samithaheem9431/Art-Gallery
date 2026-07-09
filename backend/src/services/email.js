import nodemailer from "nodemailer";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "abdulsamikhan471@gmail.com";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
}

export async function sendContactNotification({ name, email, phone, message }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not configured (set SMTP_USER and SMTP_PASS). Skipping notification.");
    return false;
  }

  const phoneLine = phone?.trim() ? phone.trim() : "Not provided";

  await transporter.sendMail({
    from: `"Zarmina Bashir Art" <${process.env.SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    replyTo: email,
    subject: `New contact message from ${name}`,
    text: [
      "You received a new message from your website contact form.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phoneLine}`,
      "",
      "Message:",
      message,
    ].join("\n"),
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; color: #1a1a1a;">
        <h2 style="font-weight: 500; margin-bottom: 24px;">New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(phoneLine)}</p>
        <p style="margin-top: 20px;"><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e7e7e2;" />
        <p style="font-size: 12px; color: #6b6b6b;">Zarmina Bashir Art — contact form</p>
      </div>
    `,
  });

  return true;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
