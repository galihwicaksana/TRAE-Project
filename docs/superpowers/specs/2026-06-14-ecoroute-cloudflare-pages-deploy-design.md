# Desain Deploy EcoRoute ke Cloudflare Pages

## Ringkasan

`EcoRoute` saat ini adalah aplikasi frontend `React + Vite + TypeScript` yang sudah berada langsung di root folder project `ecoroute/`. Karena aplikasi ini pada tahap sekarang berjalan aman dengan `VITE_API_MODE=demo`, target deploy paling cocok adalah `Cloudflare Pages` dengan sumber dari repository GitHub `galihwicaksana/TRAE-Project`.

Tujuan deploy pertama adalah menerbitkan versi publik yang stabil dengan subdomain default `*.pages.dev`, tanpa ketergantungan pada backend live. Pendekatan ini meminimalkan kompleksitas dan memungkinkan aplikasi segera dipresentasikan atau dibagikan.

## Tujuan

- Mendeploy frontend `EcoRoute` ke `Cloudflare Pages`.
- Menjadikan branch `main` sebagai source production deploy.
- Menjaga aplikasi tetap berjalan penuh lewat mode `demo`.
- Memastikan routing SPA tetap berfungsi saat refresh di route non-root.

## Di luar cakupan

- Deploy backend live.
- Integrasi `Cloudflare Workers` untuk API edge.
- Custom domain pada deploy pertama.
- CI/CD tambahan di luar alur bawaan `Cloudflare Pages`.

## Rekomendasi Pendekatan

Pendekatan yang dipilih adalah `Cloudflare Pages via GitHub integration`.

Alasannya:

- paling cocok untuk project `Vite` statis,
- paling sederhana untuk pemeliharaan,
- otomatis redeploy saat ada push ke `main`,
- tidak membutuhkan infrastruktur backend tambahan untuk tahap sekarang.

## Konfigurasi Build

Project deploy di `Cloudflare Pages` harus memakai konfigurasi berikut:

- Framework preset: `Vite`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: kosong atau `/`
- Node version: gunakan default `Cloudflare Pages` yang kompatibel dengan `Vite 5`

## Konfigurasi Environment

Untuk deploy awal, environment variable production yang dipakai:

- `VITE_API_MODE=demo`

Environment variable opsional:

- `VITE_API_BASE_URL`

`VITE_API_BASE_URL` belum perlu diisi pada deploy pertama karena aplikasi akan tetap memakai mode demo. Variabel ini baru diperlukan saat frontend diarahkan ke backend live.

## Routing SPA

Karena `EcoRoute` memakai `react-router-dom` sebagai SPA router, semua route aplikasi harus difallback ke `index.html`.

Route yang perlu aman saat dibuka langsung atau di-refresh antara lain:

- `/`
- `/routes`
- `/analytics`
- `/leaderboard`
- `/rewards`
- `/notifications`

Solusi yang dipilih:

- tambahkan file `_redirects` di root project,
- isi aturan fallback untuk seluruh route non-file ke `/index.html`.

Konfigurasi fallback:

```text
/* /index.html 200
```

## Alur Deploy

1. Source code disimpan di GitHub repository `galihwicaksana/TRAE-Project`.
2. `Cloudflare Pages` dihubungkan ke repository tersebut.
3. `Cloudflare Pages` membangun project dari branch `main`.
4. Hasil build diambil dari folder `dist`.
5. Deploy dipublikasikan ke subdomain default `*.pages.dev`.

## Validasi Setelah Deploy

Checklist validasi pertama:

- homepage berhasil dibuka,
- asset CSS dan JS termuat normal,
- semua halaman router bisa dibuka langsung,
- refresh di route non-root tidak menghasilkan `404`,
- fitur demo tetap menampilkan data,
- tidak ada error fatal akibat backend tidak tersedia.

## Risiko dan Mitigasi

### Route SPA gagal saat refresh

Risiko:

- route seperti `/routes` atau `/analytics` menghasilkan `404`.

Mitigasi:

- tambahkan `_redirects` dengan fallback ke `index.html`.

### App mencoba memanggil backend yang belum tersedia

Risiko:

- halaman gagal memuat jika mode API tidak sesuai.

Mitigasi:

- set `VITE_API_MODE=demo` di `Cloudflare Pages`.

### Perubahan future ke backend live

Risiko:

- frontend perlu diarahkan ulang ke API production.

Mitigasi:

- siapkan `VITE_API_BASE_URL` sebagai environment variable terpisah,
- jangan hardcode endpoint production di source code.

## Implementasi yang Diperlukan

Perubahan code yang dibutuhkan untuk deploy ini kecil dan terfokus:

- tambahkan file `_redirects` di root project,
- pastikan dokumentasi deploy di `README.md` relevan,
- verifikasi build lokal sebelum deploy.

## Kriteria Selesai

Deploy dianggap selesai jika:

- `Cloudflare Pages` berhasil build dari GitHub,
- aplikasi dapat diakses melalui subdomain `pages.dev`,
- route SPA dapat di-refresh tanpa error,
- mode demo berjalan normal di production.
