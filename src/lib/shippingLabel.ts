import type { Order } from "@/store/ordersApi";
import { assets } from "@/data/assets";
import { contact } from "@/data/contact";

// The page is the label itself: A4 wide and 200 mm tall, so it still prints on A4.
const W = 210;
const H = 200;
const M = 10;
// Ship-to on the left, items on the right.
const COL = 118;
const GAP = 8;

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
  let y = M;

  // Header: logo, order number and date.
  if (logo) doc.addImage(logo, "PNG", M, y, 62, 62 * (392 / 2045));
  else doc.setFont("helvetica", "bold").setFontSize(26).text("EMPULSE", M, y + 9);
  doc.setFont("helvetica", "bold").setFontSize(18).text(`Order #${orderNo}`, W - M, y + 5, { align: "right" });
  doc
    .setFont("helvetica", "normal")
    .setFontSize(12)
    .text(new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }), W - M, y + 11.5, {
      align: "right",
    });
  y += 19;

  // Payment box: what the rider collects.
  doc.setLineWidth(0.7).rect(M, y, W - 2 * M, 22);
  doc.setFont("helvetica", "bold").setFontSize(16).text(cod ? "CASH ON DELIVERY" : "PREPAID (CARD)", M + 5, y + 9.5);
  doc.setFont("helvetica", "normal").setFontSize(12).text(cod ? "Collect from customer" : "Do not collect cash", M + 5, y + 16.5);
  doc.setFont("helvetica", "bold").setFontSize(30).text(cod ? money(order.total) : "Rs. 0", W - M - 5, y + 14.5, { align: "right" });
  y += 32;
  const top = y;

  // Ship to (left column).
  doc.setFont("helvetica", "bold").setFontSize(11).text("SHIP TO", M, y);
  y += 10.5;
  doc.setFontSize(24).text(doc.splitTextToSize(`${a.firstName} ${a.lastName}`.trim(), COL - M)[0], M, y);
  y += 10;
  doc.setFont("helvetica", "normal").setFontSize(15);
  const street = [a.address, a.apartment].filter(Boolean).join(", ");
  const lines = (doc.splitTextToSize(street, COL - M) as string[]).slice(0, 4);
  doc.text(lines, M, y);
  y += lines.length * 6.5 + 4;
  const city = [a.city, a.state, a.postalCode].filter(Boolean).join(", ");
  doc.setFont("helvetica", "bold").setFontSize(20).text(city.toUpperCase(), M, y);
  y += 12;
  doc.setFontSize(22).text(`Phone: ${a.phone}`, M, y);

  // Items (right column), so the parcel can be checked before sealing.
  const x = COL + GAP;
  const width = W - M - x;
  const footerTop = H - M - 16;
  doc.setLineWidth(0.2).line(COL + GAP / 2, top - 4, COL + GAP / 2, footerTop - 3);
  let iy = top;
  const count = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  doc.setFont("helvetica", "bold").setFontSize(11).text(`ITEMS (${count})`, x, iy);
  iy += 8;
  doc.setFont("helvetica", "normal").setFontSize(12);
  for (const [index, item] of order.orderItems.entries()) {
    const detail = [item.variant, item.size && `Size ${item.size}`].filter(Boolean).join(" · ");
    const text = doc.splitTextToSize(`${item.quantity} × ${item.name}${detail ? ` (${detail})` : ""}`, width) as string[];
    if (iy + text.length * 5.2 > footerTop - 6) {
      doc.text(`+ ${order.orderItems.length - index} more item(s)`, x, iy);
      break;
    }
    doc.text(text, x, iy);
    iy += text.length * 5.2 + 2.5;
  }

  // From: where the courier returns it.
  y = footerTop;
  doc.setLineWidth(0.2).line(M, y, W - M, y);
  y += 7;
  doc.setFont("helvetica", "bold").setFontSize(11).text("FROM", M, y);
  doc.setFont("helvetica", "normal").text(`Empulse · empulse.store · WhatsApp ${contact.whatsapp}`, M + 15, y);
  y += 6;
  doc.setFontSize(10).text("First check then pay. If undelivered, please return to sender. Thank you for shopping with Empulse!", M, y);

  doc.save(`empulse-order-${orderNo}-${a.firstName || "label"}.pdf`.replace(/\s+/g, "-"));
}
