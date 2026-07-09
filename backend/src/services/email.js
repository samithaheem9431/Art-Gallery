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

export async function sendOrderNotification(order) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not configured (set SMTP_USER and SMTP_PASS). Skipping notification.");
    return false;
  }

  const customer = order.customer || {};
  const customerName = customer.name || "Unknown";
  const customerEmail = customer.email || "Not provided";
  const customerPhone = customer.phone?.trim() || "Not provided";
  const customerAddress = customer.address?.trim() || "Not provided";
  const customerCountry = customer.country?.trim() || "Not provided";
  const currency = order.currency || "PKR";

  const items = Array.isArray(order.items) ? order.items : [];
  const itemLines = items.map((item, idx) => {
    const title = item.title || "Untitled product";
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    return `${idx + 1}. ${title} — Qty: ${qty}, Price: ${currency} ${price.toLocaleString("en-PK")}`;
  });

  await transporter.sendMail({
    from: `"Zarmina Bashir Art" <${process.env.SMTP_USER}>`,
    to: NOTIFY_EMAIL,
    replyTo: customerEmail,
    subject: `New order placed by ${customerName}`,
    text: [
      "A new order has been placed on your website.",
      "",
      `Order ID: ${order._id}`,
      `Customer: ${customerName}`,
      `Email: ${customerEmail}`,
      `Phone: ${customerPhone}`,
      `Address: ${customerAddress}`,
      `Country: ${customerCountry}`,
      "",
      "Products:",
      ...itemLines,
      "",
      `Total: ${currency} ${(Number(order.total) || 0).toLocaleString("en-PK")}`,
    ].join("\n"),
    html: `
      <div style="font-family: Georgia, serif; max-width: 620px; color: #1a1a1a;">
        <h2 style="font-weight: 500; margin-bottom: 20px;">New order placed</h2>
        <p><strong>Order ID:</strong> ${escapeHtml(order._id)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(customerEmail)}">${escapeHtml(
      customerEmail
    )}</a></p>
        <p><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
        <p><strong>Address:</strong> ${escapeHtml(customerAddress)}</p>
        <p><strong>Country:</strong> ${escapeHtml(customerCountry)}</p>
        <h3 style="margin-top: 24px; margin-bottom: 10px; font-weight: 500;">Products</h3>
        <ul style="margin: 0 0 14px 18px; padding: 0; line-height: 1.6;">
          ${items
            .map((item) => {
              const title = item.title || "Untitled product";
              const qty = Number(item.quantity) || 1;
              const price = Number(item.price) || 0;
              return `<li>${escapeHtml(title)} — Qty: ${qty}, Price: ${currency} ${price.toLocaleString(
                "en-PK"
              )}</li>`;
            })
            .join("")}
        </ul>
        <p style="font-size: 18px;"><strong>Total:</strong> ${currency} ${(
      Number(order.total) || 0
    ).toLocaleString("en-PK")}</p>
        <hr style="margin: 26px 0; border: none; border-top: 1px solid #e7e7e2;" />
        <p style="font-size: 12px; color: #6b6b6b;">Zarmina Bashir Art — order notification</p>
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
