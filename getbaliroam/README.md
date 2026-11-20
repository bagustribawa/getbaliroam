# GetBaliRoam

Website penjualan eSIM/SIM Bali. Frontend HTML statis + 1 serverless function untuk Xendit.

## Struktur
```
index.html            halaman utama + checkout modal
success.html         halaman setelah pembayaran
api/create-invoice.js  membuat invoice Xendit (Vercel Function)
images/               taruh foto Anda di sini (lihat bawah)
```

## Foto
Taruh file ini di folder `images/` (jika tidak ada, tampil gradient + emoji):
`hero.jpg`, `tsel-bali.jpg`, `xl-bali.jpg`, `tsel-id.jpg`, `tsel-long.jpg`, `tsel-sim.jpg`, `xl-sim.jpg`, `tsel-topup.jpg`, `xl-topup.jpg`

## Deploy (Vercel, gratis)
1. Upload semua file ke repo GitHub.
2. vercel.com > Add New Project > pilih repo > Deploy.
3. Settings > Environment Variables:
   - `XENDIT_SECRET_KEY` = secret key dari dashboard Xendit (pakai key **TEST** dulu: `xnd_development_...`)
   - `SITE_URL` = `https://getbaliroam.com`
4. Settings > Domains > tambahkan `getbaliroam.com`.
5. Uji pembayaran dengan key test, lalu ganti ke key **LIVE** (`xnd_production_...`).

> GitHub Pages saja tidak cukup: kunci rahasia Xendit tidak boleh ada di HTML dan butuh server.

## Yang masih perlu Anda tambahkan
- **Webhook Xendit** (`/api/xendit-webhook`): terima status `PAID`, lalu kirim eSIM/QR ke email pembeli. Atur callback URL di dashboard Xendit > Settings > Webhooks.
- Nomor WhatsApp & email asli (cari `0000` di index.html).
- Halaman Refund Policy dan Privacy Policy.
- Harga: ubah di `index.html` (tampilan) **dan** `api/create-invoice.js` (harga yang ditagih).
