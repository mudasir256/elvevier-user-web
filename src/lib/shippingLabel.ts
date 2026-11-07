import type { Order } from "@/store/ordersApi";
import { assets } from "@/data/assets";
import { contact } from "@/data/contact";

// The page is the label itself: a landscape strip as long as A4 and half as tall
// (297 × 105 mm), so two fit on one A4 sheet.
const W = 297;
const H = 105;
const M = 8;
// Three columns: ship to, items, and what the rider collects.
const ITEMS_X = 150;
const PAY_X = 226;
const GAP = 6;

async function logoDataUrl() {
  try {
    const blob = await (await fetch(assets.logo)).blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function money(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export async function downloadShippingLabel(order: Order) {
  const [{ jsPDF }, logo] = await Promise.all([import("jspdf"), logoDataUrl()]);
  // jsPDF turns a wide format upright unless the orientation says landscape.
  const doc = new jsPDF({ unit: "mm", format: [W, H], orientation: "landscape" });
  const a = order.deliveryAddress;
  const orderNo = order._id.slice(-6).toUpperCase();
  const cod = (order.paymentMethod ?? "cod") === "cod";
  const date = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });

  // Header: logo, order number and date.
  if (logo) doc.addImage(logo, "PNG", M, M, 46, 46 * (392 / 2045));
  else doc.setFont("helvetica", "bold").setFontSize(20).text("EMPULSE", M, M + 7);
  doc.setFont("helvetica", "bold").setFontSize(15).text(`Order #${orderNo}`, W - M, M + 5, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).text(date, W - M, M + 10, { align: "right" });

  const top = M + 19;
  const footerTop = H - M - 6;
  doc.setLineWidth(0.3).line(M, top - 5, W - M, top - 5);

  // Ship to (left column).
  const shipWidth = ITEMS_X - GAP - M;
  let y = top;
  doc.setFont("helvetica", "bold").setFontSize(9).text("SHIP TO", M, y);
  y += 7.5;
  doc.setFontSize(19).text(doc.splitTextToSize(`${a.firstName} ${a.lastName}`.trim(), shipWidth)[0], M, y);
  y += 7;
  doc.setFont("helvetica", "normal").setFontSize(12);
  const street = [a.address, a.apartment].filter(Boolean).join(", ");
  const lines = (doc.splitTextToSize(street, shipWidth) as string[]).slice(0, 3);
  doc.text(lines, M, y);
  y += lines.length * 5 + 3;
  const city = [a.city, a.state, a.postalCode].filter(Boolean).join(", ");
  doc.setFont("helvetica", "bold").setFontSize(16).text(doc.splitTextToSize(city.toUpperCase(), shipWidth)[0], M, y);
  y += 8.5;
  doc.setFontSize(17).text(`Phone: ${a.phone}`, M, y);

  // Items (middle column), so the parcel can be checked before sealing.
  doc.setLineWidth(0.2).line(ITEMS_X - GAP / 2, top - 1, ITEMS_X - GAP / 2, footerTop - 3);
  const itemsWidth = PAY_X - GAP - ITEMS_X;
  let iy = top;
  const count = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  doc.setFont("helvetica", "bold").setFontSize(9).text(`ITEMS (${count})`, ITEMS_X, iy);
  iy += 6;
  doc.setFont("helvetica", "normal").setFontSize(10);
  for (const [index, item] of order.orderItems.entries()) {
    const detail = [item.variant, item.size && `Size ${item.size}`].filter(Boolean).join(" · ");
    const text = doc.splitTextToSize(`${item.quantity} × ${item.name}${detail ? ` (${detail})` : ""}`, itemsWidth) as string[];
    if (iy + text.length * 4.3 > footerTop - 7) {
      doc.text(`+ ${order.orderItems.length - index} more item(s)`, ITEMS_X, iy);
      break;
    }
    doc.text(text, ITEMS_X, iy);
    iy += text.length * 4.3 + 1.8;
  }

  // Payment box (right column): what the rider collects.
  const boxWidth = W - M - PAY_X;
  const boxTop = top - 1;
  const boxHeight = footerTop - 3 - boxTop;
  const centre = PAY_X + boxWidth / 2;
  doc.setLineWidth(0.8).rect(PAY_X, boxTop, boxWidth, boxHeight);
  doc.setFont("helvetica", "bold").setFontSize(12).text(cod ? "CASH ON DELIVERY" : "PREPAID (CARD)", centre, boxTop + 10, { align: "center" });
  doc.setFont("helvetica", "normal").setFontSize(9.5).text(cod ? "Collect from customer" : "Do not collect cash", centre, boxTop + 16, { align: "center" });
  // Shrink a very large amount until it fits the box.
  const amount = cod ? money(order.total) : "Rs. 0";
  let size = 26;
  doc.setFont("helvetica", "bold");
  while (size > 14 && doc.setFontSize(size).getTextWidth(amount) > boxWidth - 6) size -= 1;
  doc.text(amount, centre, boxTop + boxHeight / 2 + 12, { align: "center" });

  // From: where the courier returns it.
  doc.setLineWidth(0.2).line(M, footerTop, W - M, footerTop);
  y = footerTop + 4.8;
  doc.setFont("helvetica", "bold").setFontSize(8.5).text("FROM", M, y);
  doc
    .setFont("helvetica", "normal")
    .text(
      `Empulse · empulse.store · WhatsApp ${contact.whatsapp}   ·   First check then pay. If undelivered, please return to sender. Thank you!`,
      M + 11,
      y
    );

  doc.save(`empulse-order-${orderNo}-${a.firstName || "label"}.pdf`.replace(/\s+/g, "-"));
}
