# EcoRoute

Frontend utama `EcoRoute` sekarang langsung berada di root folder `ecoroute/`, jadi tidak perlu lagi masuk ke folder `frontend/`.

## Struktur

- `src/` untuk source code aplikasi
- `public/` untuk aset statis dan file deploy seperti `_redirects`
- `docs/` untuk dokumen spesifikasi dan plan yang masih dipakai
- `index.html`, `vite.config.ts`, `tsconfig*.json`, dan `package.json` langsung di root project

## Menjalankan

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy Cloudflare Pages

Deploy yang direkomendasikan memakai `Cloudflare Pages` dari repository GitHub.

Konfigurasi utama:

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_MODE=demo`

Project ini sudah menyertakan file `public/_redirects` agar routing SPA tetap aman saat refresh di route seperti `/routes` atau `/analytics`.
