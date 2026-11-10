import { SITE_URL } from "@/lib/site";
import { contact } from "@/data/contact";

// Order emails go through Resend (resend.com). Set RESEND_API_KEY to turn them on.
// ORDER_EMAIL_FROM must use a domain verified in Resend, e.g. "Empulse <orders@empulse.store>".
const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Empulse <orders@empulse.store>";
// Customer replies land in the Empulse inbox.
const DEFAULT_REPLY_TO = contact.email;
// Where the "new order" alert goes. ORDER_ALERT_EMAIL may list several addresses, comma separated.
const DEFAULT_ALERT_TO = contact.email;

export type OrderEmail = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  phone: string;
  items: { name: string; variant?: string; size?: string; price: number; quantity: number; image?: string }[];
  subtotal: number;
  shipping: string;
  total: number;
  discount?: number;
  promoCode?: string;
  paymentMethod: string;
};

function escape(value: string) {
  return value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

function money(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
}

function absolute(url = "") {
  if (!url) return "";
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function orderNumber(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function confirmationHtml(order: OrderEmail) {
  const cod = true; // No online payment gateway yet: every order is cash on delivery (see shippingLabel.ts).
  const rows = order.items
    .map((item) => {
      const details = [item.variant, item.size ? `Size ${item.size}` : "", `Qty ${item.quantity}`].filter(Boolean).join(" · ");
      const image = absolute(item.image);
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #f0e8ec;width:72px;vertical-align:top">
            ${image ? `<img src="${escape(image)}" width="64" height="80" alt="" style="display:block;width:64px;height:80px;object-fit:cover;border-radius:10px;background:#f4e6ec">` : ""}
          </td>
          <td style="padding:12px 12px;border-bottom:1px solid #f0e8ec;vertical-align:top">
            <div style="font-size:14px;font-weight:600;color:#2c2825">${escape(item.name)}</div>
            <div style="font-size:12px;color:#8a7f78;margin-top:4px">${escape(details)}</div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #f0e8ec;text-align:right;vertical-align:top;font-size:14px;font-weight:600;color:#4a142a;white-space:nowrap">
            ${money(item.price * item.quantity)}
          </td>
        </tr>`;
    })
    .join("");
  const address = [order.address, order.apartment ?? "", order.city].filter(Boolean).map(escape).join("<br>");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#faf8f5;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;padding:32px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(74,20,42,0.08)">
          <tr><td style="height:6px;background:linear-gradient(90deg,#c989a3,#4a142a);background-color:#4a142a"></td></tr>
          <tr><td style="padding:32px 32px 8px;text-align:center">
            <img src="${SITE_URL}/kairo/finallogo.png" width="140" alt="Empulse" style="display:inline-block;width:140px;height:auto">
            <p style="margin:28px 0 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#4a142a">Order confirmed</p>
            <h1 style="margin:10px 0 0;font-size:24px;line-height:1.3;color:#2c2825">Thank you, ${escape(order.firstName)}!</h1>
            <p style="margin:12px 0 0;font-size:14px;line-height:1.7;color:#6b6560">
              We have received your order and are getting it ready.<br>We will call you on ${escape(order.phone)} to confirm it.
            </p>
            <p style="display:inline-block;margin:20px 0 0;padding:8px 16px;border-radius:999px;background:#f4e6ec;font-size:13px;font-weight:600;color:#4a142a">
              Order #${orderNumber(order.id)}
            </p>
          </td></tr>
          <tr><td style="padding:16px 32px 0">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;font-size:14px;color:#6b6560">
              <tr><td style="padding:4px 0">Subtotal</td><td style="padding:4px 0;text-align:right">${money(order.subtotal)}</td></tr>
              ${order.discount ? `<tr><td style="padding:4px 0">Discount${order.promoCode ? ` (${escape(order.promoCode)})` : ""}</td><td style="padding:4px 0;text-align:right;color:#4a142a">- ${money(order.discount)}</td></tr>` : ""}
              <tr><td style="padding:4px 0">Shipping</td><td style="padding:4px 0;text-align:right">${escape(order.shipping)}</td></tr>
              <tr><td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#2c2825">Total</td><td style="padding:10px 0 0;text-align:right;font-size:16px;font-weight:700;color:#4a142a">${money(order.total)}</td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:24px 32px 0">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;border-radius:14px">
              <tr>
                <td style="padding:16px;vertical-align:top;width:50%">
                  <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a7f78">Delivering to</div>
                  <div style="margin-top:6px;font-size:13px;line-height:1.6;color:#2c2825">${escape(`${order.firstName} ${order.lastName}`)}<br>${address}</div>
                </td>
                <td style="padding:16px;vertical-align:top;width:50%">
                  <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a7f78">Payment</div>
                  <div style="margin-top:6px;font-size:13px;line-height:1.6;color:#2c2825">${cod ? "Cash on delivery<br>First check, then pay" : "Card"}</div>
                </td>
              </tr>
            </table>
          </td></tr>
          <tr><td style="padding:28px 32px 8px;text-align:center">
            <a href="${SITE_URL}/order/${escape(order.id)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#4a142a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">View your order</a>
          </td></tr>
          <tr><td style="padding:24px 32px 32px;text-align:center;font-size:12px;line-height:1.7;color:#8a7f78">
            Nationwide delivery · 100% original · First check then pay<br>
            Questions? Just reply to this email.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// Pakistani numbers as WhatsApp wants them: 0322 403 6100 -> 923224036100.
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("3")) return `92${digits}`;
  return digits;
}

// The message the team sends the customer on WhatsApp to confirm the order.
export function whatsappConfirmMessage(order: OrderEmail) {
  const cod = true; // No online payment gateway yet: every order is cash on delivery (see shippingLabel.ts).
  const items = order.items.map((item) => {
    const details = [item.variant, item.size ? `Size ${item.size}` : ""].filter(Boolean).join(", ");
    return `- ${item.quantity} x ${item.name}${details ? ` (${details})` : ""}: ${money(item.price * item.quantity)}`;
  });
  const address = [order.address, order.apartment, order.city].filter(Boolean).join(", ");
  return [
    `Hello ${order.firstName}!`,
    "Thank you for shopping with Empulse.",
    "",
    `Please confirm your order #${orderNumber(order.id)}:`,
    ...items,
    "",
    `Subtotal: ${money(order.subtotal)}`,
    ...(order.discount ? [`Discount${order.promoCode ? ` (${order.promoCode})` : ""}: - ${money(order.discount)}`] : []),
    `Delivery: ${order.shipping}`,
    `Total: ${money(order.total)}${cod ? " (Cash on delivery)" : " (Paid by card)"}`,
    "",
    `Delivery address: ${address}`,
    `Phone: ${order.phone}`,
    "",
    "Reply YES to confirm your order, or let us know if you want any change.",
    "Team Empulse",
  ].join("\n");
}

function alertHtml(order: OrderEmail) {
  const cod = true; // No online payment gateway yet: every order is cash on delivery (see shippingLabel.ts).
  const units = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const message = whatsappConfirmMessage(order);
  const whatsappLink = `https://wa.me/${whatsappNumber(order.phone)}?text=${encodeURIComponent(message)}`;
  const address = [order.address, order.apartment ?? "", order.city].filter(Boolean).map(escape).join(", ");
  const detail = (label: string, value: string) => `
              <tr>
                <td style="padding:6px 0;width:90px;vertical-align:top;font-size:12px;color:#8a7f78">${label}</td>
                <td style="padding:6px 0;vertical-align:top;font-size:13px;line-height:1.6;color:#2c2825">${value}</td>
              </tr>`;
  const items = order.items
    .map((item) => {
      const details = [item.variant, item.size ? `Size ${item.size}` : ""].filter(Boolean).join(" · ");
      return `<tr>
                <td style="padding:6px 0;font-size:13px;color:#2c2825">${item.quantity} × ${escape(item.name)}${details ? `<div style="font-size:12px;color:#8a7f78">${escape(details)}</div>` : ""}</td>
                <td style="padding:6px 0;text-align:right;vertical-align:top;font-size:13px;font-weight:600;color:#4a142a;white-space:nowrap">${money(item.price * item.quantity)}</td>
              </tr>`;
    })
    .join("");

  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#faf8f5;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
          <tr><td style="height:6px;background-color:#4a142a"></td></tr>
          <tr><td style="padding:24px 28px 8px;text-align:center">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#4a142a">New order</p>
            <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#2c2825">${money(order.total)} · ${units} item${units === 1 ? "" : "s"} · ${cod ? "COD" : "Card"}</h1>
            <p style="display:inline-block;margin:12px 0 0;padding:6px 14px;border-radius:999px;background:#f4e6ec;font-size:13px;font-weight:600;color:#4a142a">Order #${orderNumber(order.id)}</p>
          </td></tr>

          <tr><td style="padding:16px 28px 0">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a7f78">WhatsApp confirmation message</div>
            <div style="margin-top:8px;padding:14px 16px;border:1px dashed #c989a3;border-radius:14px;background:#fdf7fa;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.6;color:#2c2825;white-space:pre-wrap">${escape(message)}</div>
            <div style="margin-top:12px;text-align:center">
              <a href="${escape(whatsappLink)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#25d366;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">Send on WhatsApp</a>
            </div>
            <p style="margin:8px 0 0;text-align:center;font-size:12px;color:#8a7f78">The button opens the customer's chat with this message typed in. You can also copy the text above.</p>
          </td></tr>

          <tr><td style="padding:20px 28px 0">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f5;border-radius:14px;padding:8px 16px">
              ${detail("Customer", escape(`${order.firstName} ${order.lastName}`))}
              ${detail("Phone", `<a href="tel:${escape(order.phone)}" style="color:#4a142a">${escape(order.phone)}</a>`)}
              ${detail("Email", `<a href="mailto:${escape(order.email)}" style="color:#4a142a">${escape(order.email)}</a>`)}
              ${detail("Address", address)}
              ${detail("Payment", cod ? `Cash on delivery: collect ${money(order.total)}` : "Paid by card")}
            </table>
          </td></tr>

          <tr><td style="padding:16px 28px 0">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">${items}</table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;border-top:1px solid #f0e8ec;font-size:13px;color:#6b6560">
              <tr><td style="padding:6px 0 2px">Subtotal</td><td style="padding:6px 0 2px;text-align:right">${money(order.subtotal)}</td></tr>
              ${order.discount ? `<tr><td style="padding:2px 0">Discount${order.promoCode ? ` (${escape(order.promoCode)})` : ""}</td><td style="padding:2px 0;text-align:right;color:#4a142a">- ${money(order.discount)}</td></tr>` : ""}
              <tr><td style="padding:2px 0">Shipping</td><td style="padding:2px 0;text-align:right">${escape(order.shipping)}</td></tr>
              <tr><td style="padding:8px 0 0;font-size:15px;font-weight:700;color:#2c2825">Total</td><td style="padding:8px 0 0;text-align:right;font-size:15px;font-weight:700;color:#4a142a">${money(order.total)}</td></tr>
            </table>
          </td></tr>

          <tr><td style="padding:24px 28px 28px;text-align:center">
            <a href="${SITE_URL}/admin/orders/${escape(order.id)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#4a142a;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">Open in admin</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// Never throws: a failed email must not fail the order.
async function send(to: string[], subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  const recipients = to.filter(Boolean);
  if (!key || !recipients.length) return;
  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ORDER_EMAIL_FROM || DEFAULT_FROM,
        to: recipients,
        reply_to: replyTo || process.env.ORDER_EMAIL_REPLY_TO || DEFAULT_REPLY_TO,
        subject,
        html,
      }),
    });
    if (!response.ok) console.error("Order email failed:", response.status, await response.text());
  } catch (err) {
    console.error("Order email error:", err);
  }
}

/** The "thank you" email after checkout. */
export function sendOrderConfirmation(order: OrderEmail) {
  return send([order.email], `Thank you for your order #${orderNumber(order.id)}`, confirmationHtml(order));
}

/** Tells the store a new order came in, with the WhatsApp message ready. Replying goes to the customer. */
export function sendNewOrderAlert(order: OrderEmail) {
  const to = (process.env.ORDER_ALERT_EMAIL || DEFAULT_ALERT_TO).split(",").map((address) => address.trim());
  const name = `${order.firstName} ${order.lastName}`.trim();
  return send(to, `New order #${orderNumber(order.id)} · ${money(order.total)} · ${name}`, alertHtml(order), order.email);
}
