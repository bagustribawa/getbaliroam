// Vercel Serverless Function: POST /api/create-invoice
// Secret key Xendit JANGAN ditaruh di index.html. Simpan di Environment Variables: XENDIT_SECRET_KEY
// Harga dihitung di sini (server), bukan dari browser, agar tidak bisa dimanipulasi.

const PRODUCTS = {
  "tsel-bali":  { name: "eSIM Telkomsel - Bali Visitor", price: 220000 },
  "xl-bali":    { name: "eSIM XL - Bali Visitor", price: 215000 },
  "tsel-id":    { name: "eSIM Telkomsel - Indonesia", price: 455000 },
  "tsel-long":  { name: "Long Stay eSIM Telkomsel (60/90 days)", price: 780000 },
  "tsel-sim":   { name: "Telkomsel Physical SIM - Hotel Delivery", price: 240000 },
  "xl-sim":     { name: "XL Physical SIM - Hotel Delivery", price: 215000 },
  "tsel-topup": { name: "Telkomsel Data Top Up", price: 100000 },
  "xl-topup":   { name: "XL Data Top Up", price: 100000 }
};

const SITE = process.env.SITE_URL || "https://getbaliroam.com";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { productId, qty, name, email, phone } = req.body || {};
  const product = PRODUCTS[productId];
  const q = Number(qty);

  if (!product || !Number.isInteger(q) || q < 1 || q > 10 || !name || !/^\S+@\S+\.\S+$/.test(email || "")) {
    return res.status(400).json({ error: "Invalid order data." });
  }

  const orderId = `GBR-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const amount = product.price * q;

  try {
    const r = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(process.env.XENDIT_SECRET_KEY + ":").toString("base64")
      },
      body: JSON.stringify({
        external_id: orderId,
        amount,
        currency: "IDR",
        description: `${product.name} x${q}`,
        payer_email: email,
        customer: { given_names: String(name).slice(0, 100), email, mobile_number: String(phone || "").slice(0, 20) },
        success_redirect_url: `${SITE}/success.html?order=${orderId}`,
        failure_redirect_url: `${SITE}/#products`,
        invoice_duration: 3600,
        items: [{ name: product.name, quantity: q, price: product.price }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data.message || "Xendit error." });
    return res.status(200).json({ invoiceUrl: data.invoice_url, orderId });
  } catch (e) {
    return res.status(500).json({ error: "Could not reach payment provider." });
  }
}
