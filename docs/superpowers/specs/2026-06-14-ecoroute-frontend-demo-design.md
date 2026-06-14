# Desain Final Frontend EcoRoute Demo

## Ringkasan

Frontend `EcoRoute` akan dibangun sebagai aplikasi web `React + Vite + TypeScript` di folder `ecoroute-frontend/` dan terhubung ke backend `ecoroute-backend` yang sudah tersedia. Aplikasi ini difokuskan untuk presentasi mentor dengan prioritas utama pada visual demo yang premium, narasi produk yang mudah dipahami, dan pengalaman interaktif yang langsung menunjukkan dampak solusi terhadap `SDG 12` dan `SDG 13`.

Keputusan utama yang dikunci:

- fokus implementasi hanya pada frontend
- frontend terhubung ke backend yang sudah ada
- prioritas utama adalah kualitas visual presentasi
- pola pengalaman yang dipakai adalah `dashboard-first demo`
- halaman awal adalah dashboard ringkas dengan tombol `Run Demo` yang dominan

## Tujuan

- Menyediakan aplikasi frontend modular yang mengonsumsi API backend `EcoRoute`.
- Menampilkan dampak dekarbonisasi logistik secara cepat dan meyakinkan saat pertama dibuka.
- Menyediakan simulasi rute multi-alamat dengan visual peta dan perbandingan urutan stop.
- Menunjukkan loop gamifikasi dari eco-driving ke poin, leaderboard, dan reward store.
- Menampilkan notifikasi realtime agar platform terasa hidup saat demo.

## Di luar cakupan

- Autentikasi dan manajemen akun.
- Integrasi peta komersial atau traffic live.
- Push notification perangkat asli.
- Panel admin terpisah.
- Penyimpanan preferensi pengguna jangka panjang.

## Pendekatan produk

Pendekatan yang dipilih adalah `Dashboard-First Demo`. Halaman awal tidak langsung auto-run simulasi, tetapi sudah hidup dengan data seed dari backend dan menyediakan tombol `Run Demo` yang sangat menonjol. Pendekatan ini dipilih karena paling sesuai dengan kebutuhan presentasi: mentor langsung melihat konteks masalah, dampak SDG, dan relevansi bisnis sebelum masuk ke fitur inti simulasi.

Alur presentasi yang dituju:

1. Buka dashboard dan lihat KPI dampak, alert aktif, dan posisi top driver.
2. Klik `Run Demo`.
3. Masuk ke simulator dengan skenario demo yang sudah terisi.
4. Jalankan simulasi dan tampilkan baseline vs optimized route.
5. Tunjukkan perubahan poin, leaderboard, reward progress, dan analytics.

## Arsitektur aplikasi

Frontend menggunakan `single-page application` dengan `React Router`.

Komponen arsitektur:

- `React` untuk UI
- `Vite` untuk build dan dev server
- `TypeScript` untuk typing
- `React Router` untuk navigasi
- `TanStack Query` untuk pengambilan dan sinkronisasi data
- `Leaflet + React Leaflet` untuk peta
- `Recharts` untuk visual analytics
- `SSE client` untuk notifikasi realtime

Layout utama menggunakan `AppShell` yang konsisten:

- sidebar kiri untuk navigasi domain
- topbar tipis untuk judul halaman dan status koneksi
- main content area
- global notification layer di bagian atas

## Struktur proyek

```text
ecoroute-frontend/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── public/
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── app/
    │   ├── providers.tsx
    │   ├── router.tsx
    │   └── layout/
    │       ├── AppShell.tsx
    │       ├── Sidebar.tsx
    │       └── Topbar.tsx
    ├── pages/
    │   ├── DashboardPage.tsx
    │   ├── AnalyticsPage.tsx
    │   ├── RouteSimulatorPage.tsx
    │   ├── LeaderboardPage.tsx
    │   ├── RewardStorePage.tsx
    │   └── NotificationsPage.tsx
    ├── components/
    ├── features/
    ├── services/
    ├── hooks/
    ├── lib/
    ├── styles/
    └── types/
```

## Routing

- `/` -> `DashboardPage`
- `/analytics` -> `AnalyticsPage`
- `/routes` -> `RouteSimulatorPage`
- `/leaderboard` -> `LeaderboardPage`
- `/rewards` -> `RewardStorePage`
- `/notifications` -> `NotificationsPage`

Semua halaman memakai shell yang sama agar platform terasa seperti satu produk, bukan kumpulan halaman demo terpisah.

## Desain pengalaman pengguna

### Dashboard

Dashboard adalah halaman pembuka dan harus langsung menjawab tiga pertanyaan:

- apa masalah yang diselesaikan
- berapa dampak yang berhasil dihasilkan
- apa aksi berikutnya yang paling penting

Isi utama dashboard:

- banner alert realtime di bagian atas
- hero panel dengan narasi singkat `EcoRoute`
- KPI utama: `CO2 reduced`, `fuel saved`, `money saved`, `success rate`
- progress target reduksi `15-20%`
- top 3 `Eco-Driver`
- preview notifikasi terbaru
- ringkasan simulasi terbaru
- tombol `Run Demo` yang dominan

### Route Simulator

Ini adalah panggung utama demonstrasi fitur.

Elemen utama:

- pemilihan driver
- origin dan multi-stop mock Indonesia
- input kecepatan simulasi
- tombol simulasi
- peta interaktif
- panel urutan input vs urutan hasil optimasi
- kartu hasil penghematan
- warning overspeed

Ketika `Run Demo` ditekan dari dashboard, halaman ini dibuka dengan skenario yang sudah terisi sehingga mentor cukup melihat lalu menjalankan simulasi.

### Analytics

Halaman ini membuktikan dampak bisnis dan lingkungan untuk manajemen UMKM.

Isi utama:

- total liter hemat
- total rupiah hemat
- total `CO2` reduced
- total poin dan driver aktif
- progress target reduksi minimum dan stretch
- grafik tren hasil simulasi
- breakdown kontribusi per tipe kendaraan

### Leaderboard

Halaman ini menunjukkan efek gamifikasi.

Isi utama:

- ranking `Top Eco-Driver`
- total poin
- total `CO2` reduced
- total jarak hemat
- badge milestone

### Reward Store

Halaman ini memperlihatkan hubungan langsung antara perilaku eco-driving dan insentif nyata.

Reward yang ditampilkan:

- `1000 poin` -> voucher BBM `Rp 50.000`
- `2500 poin` -> voucher BBM `Rp 150.000`
- `5000 poin` -> paket data `50GB`

Interaksi utama:

- lihat poin aktif driver
- lihat kartu reward
- redeem reward
- tampilkan feedback berhasil atau gagal
- tampilkan celebration popup untuk milestone

### Notifications

Halaman ini menampilkan feed event sistem dan status realtime.

Isi utama:

- daftar notifikasi
- severity badge
- filter tipe event
- status koneksi stream

## Komponen reusable

Komponen yang direncanakan:

- `KpiCard`
- `ProgressCard`
- `AlertBanner`
- `SectionHeader`
- `StatBadge`
- `CelebrationModal`
- `LoadingPanel`
- `EmptyState`
- `InfoPill`
- `RewardCard`
- `LeaderboardTable`
- `NotificationFeed`
- `RouteMapPanel`
- `StopSequencePanel`

## Integrasi backend

Endpoint yang akan dipakai:

- `GET /api/v1/drivers`
- `GET /api/v1/drivers/:driverId`
- `GET /api/v1/routes/mock-addresses`
- `POST /api/v1/routes/simulate`
- `GET /api/v1/routes/:routeId`
- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/drivers/:driverId`
- `GET /api/v1/analytics/leaderboard-summary`
- `GET /api/v1/leaderboard`
- `GET /api/v1/rewards`
- `POST /api/v1/rewards/redeem`
- `GET /api/v1/rewards/redemptions/:driverId`
- `GET /api/v1/notifications`
- `GET /api/v1/notifications/stream`

`api-client.ts` menjadi satu titik konfigurasi base URL, misalnya `http://localhost:3000/api/v1`.

## Data flow

### Initial load

Saat aplikasi dibuka:

- ambil `analytics overview`
- ambil daftar driver
- ambil leaderboard
- ambil reward
- ambil notifikasi
- buka koneksi `SSE`

Tujuannya agar dashboard langsung hidup sejak awal.

### Run Demo flow

Saat pengguna menekan `Run Demo`:

1. aplikasi membuka halaman simulator
2. form langsung terisi driver, origin, dan daftar stop demo
3. pengguna menjalankan simulasi
4. frontend mengirim `POST /api/v1/routes/simulate`
5. hasil dipetakan ke peta, panel urutan, KPI hasil, dan notifikasi
6. query `analytics`, `leaderboard`, `driver`, dan `notifications` di-refresh

### Reward flow

Saat pengguna menekan tombol redeem:

1. frontend kirim `POST /api/v1/rewards/redeem`
2. jika berhasil, poin driver diperbarui
3. tampilkan toast sukses
4. refresh riwayat redeem dan status reward

## Realtime

Event `SSE` dipresentasikan sebagai berikut:

- `route_optimized` -> banner sukses di dashboard atau simulator
- `overspeed_warning` -> warning visual instan di simulator
- `reward_milestone` -> `CelebrationModal`
- `reward_redeemed` -> toast sukses dan item baru di feed notifikasi

Topbar menampilkan status stream:

- `Connected`
- `Reconnecting`
- `Disconnected`

## Peta dan visualisasi

Peta memakai `Leaflet`.

Elemen wajib:

- marker origin
- marker stop
- polyline baseline
- polyline optimized
- popup nama lokasi
- legenda perbedaan warna

Panel pendamping di samping peta menampilkan:

- urutan input
- urutan hasil optimasi
- perubahan posisi stop
- daftar lokasi yang dipilih

## Sistem desain

Tema visual mengikuti `Eco-Green Clean Corporate Dashboard`.

Token warna utama:

- `--bg` = deep slate green
- `--surface` = dark panel green
- `--surface-2` = elevated green panel
- `--text` = off-white
- `--text-muted` = sage
- `--accent` = neon lime
- `--accent-2` = emerald
- `--warning` = amber
- `--danger` = soft red
- `--line` = translucent sage border

Aturan visual:

- nuansa korporat premium, bukan template admin generik
- panel dengan radius sedang dan shadow halus
- glow terbatas hanya pada metrik penting
- spacing lega dan hirarki visual jelas
- grafik dan peta memakai palet yang sama dengan UI

## Responsif

Target utama adalah desktop dan laptop untuk presentasi.

Aturan minimum:

- sidebar bisa collapse
- KPI grid turun ke 2 kolom lalu 1 kolom
- panel peta dan urutan stop menjadi stacked di layar sempit
- tabel leaderboard tetap scrollable

## Loading, empty, dan error states

Setiap halaman harus menyiapkan:

- `loading state`
- `empty state`
- `error state`

Perilaku khusus:

- jika backend belum aktif, tampilkan panel `Backend belum terhubung`
- jika belum ada simulasi baru, tampilkan seed visual agar simulator tidak kosong
- jika stream notifikasi terputus, tampilkan indikator non-kritis
- jika poin tidak cukup saat redeem, tampilkan feedback jelas di kartu reward

## Urutan implementasi

1. Bootstrap project `Vite + React + TypeScript`
2. Setup `providers`, router, dan API client
3. Setup token CSS dan global styles
4. Implementasi `AppShell`, `Sidebar`, dan `Topbar`
5. Implementasi `DashboardPage`
6. Implementasi `RouteSimulatorPage`
7. Integrasi peta dan panel stop sequence
8. Implementasi `LeaderboardPage`
9. Implementasi `RewardStorePage`
10. Implementasi `AnalyticsPage`
11. Implementasi `NotificationsPage`
12. Integrasi `SSE`
13. Polish visual, motion ringan, dan state feedback

## Pengujian

Verifikasi manual minimal:

- semua route halaman terbuka
- data dashboard termuat dari backend
- `Run Demo` mengisi skenario simulator
- simulasi menghasilkan perbandingan baseline vs optimized route
- warning overspeed muncul saat kecepatan lebih dari `80 km/jam`
- leaderboard dan analytics ikut terbarui setelah simulasi
- reward bisa diredeem bila poin cukup
- milestone dan notifikasi realtime tampil dengan benar

## Risiko dan mitigasi

### Risiko dashboard terasa padat

Mitigasi: fokuskan dashboard hanya pada ringkasan dan CTA, detail domain dipindah ke halaman masing-masing.

### Risiko simulator kosong sebelum dijalankan

Mitigasi: tampilkan seed route dan data contoh saat initial state.

### Risiko UI terlihat generik

Mitigasi: semua warna, panel, spacing, dan chart diikat ke token desain sejak awal.

## Catatan operasional

Dokumen ini adalah desain final yang menggabungkan konteks backend yang sudah ada dan keputusan presentasi yang telah disetujui pengguna setelah sesi brainstorming. Workspace saat ini belum terdeteksi sebagai repository git pada folder `d:\Galih\Workshop TRAE`, sehingga dokumen tidak dapat dikomit dari root workspace pada tahap ini.
