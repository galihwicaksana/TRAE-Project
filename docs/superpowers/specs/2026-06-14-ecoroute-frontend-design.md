# Desain Frontend EcoRoute

## Ringkasan

Frontend `EcoRoute` akan dibangun sebagai aplikasi `React + Vite + TypeScript` dengan pendekatan `dashboard modular` dan halaman terpisah. Fokusnya adalah menampilkan dampak dekarbonisasi logistik secara visual, membuat simulasi rute terasa hidup saat presentasi, dan menunjukkan loop gamifikasi driver dari penghematan rute ke poin, leaderboard, dan reward store.

Tampilan akan mengikuti tema `Eco-Green Clean Corporate Dashboard` dengan karakter visual modern, premium, dan berorientasi data. Semua halaman dipusatkan pada konteks pengguna di `Malang, Jawa Timur`, sehingga narasi demo, daftar lokasi, dan angka operasional akan terasa relevan dengan kondisi nyata pengguna.

## Tujuan

- Menyediakan dashboard frontend yang terhubung ke backend `EcoRoute`.
- Menampilkan KPI penghematan BBM, biaya operasional, dan reduksi `CO2` secara jelas.
- Menyediakan simulasi rute multi-stop dengan peta interaktif dan panel urutan stop.
- Menampilkan leaderboard `Top Eco-Driver` dan reward store mock.
- Menangani notifikasi realtime dari backend melalui `SSE`.
- Menciptakan tampilan presentasi yang kuat untuk mentor dan mudah diteruskan ke `TRAE Code`.

## Di luar cakupan

- Login atau autentikasi mock.
- Role management admin vs driver.
- CMS pengelolaan master data.
- Export PDF, Excel, atau laporan cetak.
- Persistensi state frontend ke URL atau local storage lanjutan.
- Integrasi push notification perangkat asli.

## Arsitektur aplikasi

Frontend menggunakan `single-page application` berbasis `React Router`. Semua halaman berada dalam satu `AppShell` yang konsisten, terdiri dari sidebar, topbar, area konten utama, dan lapisan notifikasi global.

Komponen arsitektur utama:

- `React` untuk UI.
- `Vite` sebagai build tool dan dev server.
- `TypeScript` untuk typing dan maintainability.
- `React Router` untuk navigasi multi-page.
- `TanStack Query` untuk fetch data server dan cache.
- `Leaflet + React Leaflet` untuk peta.
- `Recharts` untuk grafik analytics.
- `SSE client` untuk notifikasi realtime dari backend.

## Struktur proyek

Struktur folder frontend yang direncanakan:

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
    │   ├── KpiCard.tsx
    │   ├── ProgressCard.tsx
    │   ├── AlertBanner.tsx
    │   ├── SectionHeader.tsx
    │   ├── EmptyState.tsx
    │   ├── StatBadge.tsx
    │   └── CelebrationModal.tsx
    ├── features/
    │   ├── analytics/
    │   ├── drivers/
    │   ├── route-simulation/
    │   ├── leaderboard/
    │   ├── rewards/
    │   └── notifications/
    ├── services/
    │   ├── api-client.ts
    │   ├── drivers.api.ts
    │   ├── analytics.api.ts
    │   ├── routes.api.ts
    │   ├── leaderboard.api.ts
    │   ├── rewards.api.ts
    │   ├── notifications.api.ts
    │   └── sse-client.ts
    ├── hooks/
    │   ├── useSSE.ts
    │   ├── useToastQueue.ts
    │   └── usePageTitle.ts
    ├── lib/
    │   ├── formatters.ts
    │   ├── chart-utils.ts
    │   └── map-utils.ts
    ├── styles/
    │   ├── tokens.css
    │   ├── globals.css
    │   └── utilities.css
    └── types/
```

## Routing

Routing utama:

- `/` → `DashboardPage`
- `/analytics` → `AnalyticsPage`
- `/routes` → `RouteSimulatorPage`
- `/leaderboard` → `LeaderboardPage`
- `/rewards` → `RewardStorePage`
- `/notifications` → `NotificationsPage`

Semua route memakai layout yang sama, sehingga perpindahan halaman terasa seperti satu platform utuh dan bukan kumpulan demo terpisah.

## Halaman

### Dashboard

Halaman pertama yang dibuka. Ia menampilkan ringkasan performa platform dan harus menjadi halaman yang paling mudah dipahami oleh mentor dalam waktu singkat.

Isi utama:

- banner alert realtime di bagian atas
- grid KPI utama
- progress target reduksi `15–20%`
- ringkasan top 3 eco-driver
- quick simulation summary
- recent notifications
- shortcut ke simulasi rute dan reward store

### Analytics

Halaman ini fokus ke kebutuhan manajemen UMKM. Tujuannya adalah memperlihatkan dampak kuantitatif secara meyakinkan.

Isi utama:

- total driver
- total poin
- total liter hemat
- total rupiah hemat
- total `CO2` reduced
- progress minimum dan stretch target
- grafik breakdown performa
- tren hasil simulasi historis

### Route Simulator

Ini adalah halaman inti presentasi karena memperlihatkan bagaimana EcoRoute bekerja.

Isi utama:

- form pilih driver
- pilih origin
- pilih multi-stop
- input kecepatan simulasi
- tombol jalankan simulasi
- peta interaktif
- panel urutan stop input vs optimal
- kartu hasil simulasi
- warning overspeed
- alert rute optimal ditemukan

Halaman ini harus menampilkan `keduanya`: peta interaktif sebagai visual utama dan panel urutan stop sebagai visual pendamping.

### Leaderboard

Halaman ini memperlihatkan efek gamifikasi pada perilaku driver.

Isi utama:

- ranking driver
- total poin
- total `CO2` reduced
- total jarak hemat
- badge milestone
- filter sederhana berdasarkan jenis kendaraan

### Reward Store

Halaman ini menunjukkan konversi dari perilaku eco-driving menjadi insentif nyata.

Isi utama:

- poin driver aktif
- daftar reward dalam bentuk card
- badge poin yang dibutuhkan
- tombol redeem
- feedback hasil redeem
- celebration modal untuk milestone atau reward tertentu

### Notifications

Halaman ini mengarsipkan alert dan event realtime dari sistem.

Isi utama:

- feed notifikasi
- severity badge
- filter tipe notifikasi
- status koneksi stream realtime

## Layout dan komponen

### AppShell

Struktur layout utama:

- sidebar tetap di kiri
- topbar tipis di atas
- konten utama di kanan
- lapisan toast / alert di atas konten

Sidebar berisi:

- Dashboard
- Analytics
- Route Simulator
- Leaderboard
- Reward Store
- Notifications

Topbar berisi:

- judul halaman aktif
- status koneksi backend
- status stream realtime

### Komponen reusable

Komponen inti yang harus reusable:

- `KpiCard`
- `ProgressCard`
- `AlertBanner`
- `SectionHeader`
- `EmptyState`
- `StatBadge`
- `CelebrationModal`
- `LoadingPanel`
- `InfoPill`

## State management

Pendekatan state:

- `TanStack Query` untuk seluruh data dari backend
- `useState` atau `useReducer` untuk state UI lokal
- context ringan untuk broadcast event notifikasi jika diperlukan

Data yang dikelola sebagai server state:

- daftar driver
- analytics overview
- leaderboard
- rewards
- notifications
- hasil route simulation
- daftar mock locations

Data yang dikelola sebagai UI state:

- sidebar open/collapse
- filter halaman
- driver terpilih
- modal celebration
- toast queue
- state form simulasi yang belum disubmit

Frontend tidak perlu `Redux` atau `Zustand` pada goals pertama.

## Integrasi backend

Endpoint backend yang dipakai:

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
- `POST /api/v1/notifications/test`

`api-client.ts` harus menjadi satu titik konfigurasi base URL, misalnya `http://localhost:3000/api/v1`.

## Realtime

Frontend harus membuka koneksi ke endpoint `SSE` backend dan menerjemahkan event menjadi pengalaman UI yang jelas.

Aturan presentasi event:

- `route_optimized` → `AlertBanner` sukses di halaman dashboard dan simulator
- `overspeed_warning` → toast warning + panel warning di halaman simulator
- `reward_milestone` → modal celebration
- `reward_redeemed` → toast sukses di reward store

Koneksi stream harus punya indikator status:

- `Connected`
- `Reconnecting`
- `Disconnected`

## Peta dan visualisasi rute

Peta dibangun dengan `Leaflet` dan `React Leaflet`.

Elemen yang wajib ditampilkan:

- marker origin
- marker stop
- polyline baseline order
- polyline optimized order
- legenda warna
- popup marker dengan nama lokasi

Warna garis yang disarankan:

- baseline route: sage muted atau amber lembut
- optimized route: neon lime / emerald

Panel urutan stop di sebelah peta harus menampilkan:

- urutan input
- urutan hasil optimasi
- pergeseran urutan
- lokasi yang dipilih

## Grafik analytics

Grafik dibangun dengan `Recharts`.

Grafik yang disarankan:

- bar chart untuk penghematan per tipe kendaraan
- line atau area chart untuk tren simulasi
- radial/progress visual untuk target reduksi

Grafik tidak boleh terlihat generik. Token warna harus diterapkan konsisten agar nuansa `climate-tech corporate` tetap terasa.

## Sistem desain

Tema visual menggunakan token CSS terpusat.

### Color tokens

- `--bg`: deep slate green
- `--surface`: dark green panel
- `--surface-2`: elevated panel
- `--text`: off-white
- `--text-muted`: sage muted
- `--accent`: neon lime
- `--accent-2`: emerald
- `--warning`: amber
- `--danger`: soft red
- `--line`: translucent sage border

### Typography

Gunakan tipografi yang modern dan mudah dibaca. Hierarki visual harus kuat, tetapi tidak berlebihan. Dashboard harus terasa profesional, bukan gaya neon gaming atau fintech glam berlebihan.

### Bentuk visual

- panel dengan radius sedang
- bayangan halus
- garis pemisah tipis
- spacing lega
- kontras tinggi antar panel

## Responsif

Target utama frontend adalah desktop atau laptop untuk presentasi, tetapi layout tetap harus turun dengan wajar ke tablet.

Aturan responsif minimum:

- sidebar bisa collapse
- grid KPI berubah menjadi 2 kolom lalu 1 kolom
- peta dan panel rute menjadi stacked di layar sempit
- tabel leaderboard tetap scrollable

## Seed visual demo

Frontend harus dibangun dengan asumsi data demo dari backend sudah ada:

- 6 driver demo
- lokasi fokus Malang Raya
- harga BBM Jawa Timur
- 3 simulasi historis
- reward store aktif

Copy atau narasi kecil dalam UI sebaiknya juga menyinggung konteks lokal, misalnya:

- `Malang Route Intelligence`
- `Eco-driving score untuk armada Jatim`
- `Simulasi distribusi Malang Raya`

## Error dan loading states

Setiap halaman harus menyiapkan:

- loading state
- empty state
- error state

Contoh:

- bila backend belum aktif, tampilkan panel `Backend belum terhubung`
- bila belum ada simulasi baru, tampilkan placeholder yang tetap estetis
- bila stream notifikasi terputus, tampilkan indikator non-kritis

## Urutan implementasi

1. Bootstrap `Vite + React + TypeScript`
2. Setup routing dan providers
3. Setup token CSS dan global styles
4. Buat `AppShell`, `Sidebar`, dan `Topbar`
5. Setup API client dan React Query
6. Implementasi `DashboardPage`
7. Implementasi `AnalyticsPage`
8. Implementasi `RouteSimulatorPage`
9. Integrasi peta dan panel urutan stop
10. Implementasi `LeaderboardPage`
11. Implementasi `RewardStorePage`
12. Implementasi `NotificationsPage`
13. Integrasi `SSE`
14. Polish visual, loading, dan empty states

## Pengujian

### Manual verification

- semua route halaman bisa dibuka
- data backend termuat dengan benar
- simulasi rute menghasilkan update UI
- peta menampilkan origin, stop, dan dua jenis polyline
- leaderboard menampilkan ranking driver
- reward store bisa merefleksikan status poin
- event `SSE` memicu toast, banner, atau modal yang sesuai

### Test yang layak ditambahkan nanti

- render test halaman utama
- API hook test untuk services
- interaction test form simulasi
- state test untuk notifikasi realtime

## Keputusan penting

- Frontend dibangun dengan `React + Vite + TypeScript`
- Pendekatan yang dipakai adalah `dashboard modular`
- Routing memakai halaman terpisah, bukan single long page
- Simulasi rute menampilkan `peta interaktif` dan `panel urutan stop`
- Tema visual mengikuti `Eco-Green Clean Corporate Dashboard`
- Konteks demo dipusatkan pada `Malang, Jawa Timur`

## Risiko dan mitigasi

### Risiko peta terlihat kosong

Jika data simulasi belum dijalankan, halaman simulator bisa terasa kosong. Mitigasinya adalah menampilkan initial state yang berisi contoh panel dan marker default dari lokasi seed.

### Risiko dashboard terasa terlalu padat

Karena banyak domain berada dalam satu app, halaman berpotensi terasa penuh. Mitigasinya adalah memecah halaman per domain dan menjaga setiap halaman hanya menonjolkan satu tujuan utama.

### Risiko styling terasa generik

Tanpa token desain yang disiplin, dashboard mudah terlihat seperti template admin biasa. Mitigasinya adalah memusatkan warna, spacing, dan style panel di layer design tokens sejak awal.

