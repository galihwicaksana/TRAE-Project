# Implementation Plan Frontend EcoRoute Demo

## Ringkasan

Plan ini menerjemahkan desain final frontend `EcoRoute` menjadi urutan implementasi yang konkret, modular, dan aman untuk demo. Target utama adalah membangun aplikasi `React + Vite + TypeScript` baru di folder `ecoroute-frontend/` yang terhubung ke backend `ecoroute-backend` dan siap dipresentasikan sebagai dashboard climate-tech bertema `Eco-Green Clean Corporate Dashboard`.

Prioritas implementasi:

- pengalaman demo yang impresif saat halaman pertama dibuka
- integrasi stabil ke API backend yang sudah tersedia
- struktur kode modular agar mudah dipelihara
- penyelesaian halaman inti lebih dahulu sebelum polishing

## Target hasil

Pada akhir implementasi, frontend harus memenuhi hasil berikut:

- dashboard pembuka menampilkan KPI, top driver, alert, dan tombol `Run Demo`
- simulator rute dapat menjalankan skenario multi-stop dari data backend
- peta menampilkan marker dan perbandingan baseline vs optimized route
- leaderboard, rewards, analytics, dan notifications membaca data backend nyata
- event `SSE` memunculkan status realtime, warning, toast, dan celebration modal
- tampilan konsisten dengan tema hijau korporat premium

## Fase implementasi

### Fase 1: Bootstrap project

Tujuan:

- membuat project `ecoroute-frontend/`
- menyiapkan `Vite + React + TypeScript`
- memasang dependensi inti

Pekerjaan:

- inisialisasi project frontend
- install `react-router-dom`
- install `@tanstack/react-query`
- install `leaflet` dan `react-leaflet`
- install `recharts`
- siapkan struktur folder dasar

Kriteria selesai:

- project dapat dijalankan lokal
- halaman default React tampil tanpa error
- struktur folder dasar sesuai desain

### Fase 2: Fondasi aplikasi

Tujuan:

- menyiapkan pondasi lintas halaman
- menyiapkan routing, providers, dan theme tokens

Pekerjaan:

- buat `providers.tsx`
- buat `router.tsx`
- buat `AppShell`, `Sidebar`, dan `Topbar`
- buat token warna dan style global
- buat util formatter dasar
- buat `api-client.ts`

Kriteria selesai:

- semua route utama dapat dibuka
- shell dan navigasi konsisten
- theme dasar sudah terpasang di seluruh halaman

### Fase 3: Data layer dan kontrak API

Tujuan:

- memastikan frontend membaca backend dengan kontrak yang rapi

Pekerjaan:

- definisikan tipe respons API
- buat service untuk `drivers`, `analytics`, `routes`, `leaderboard`, `rewards`, `notifications`
- buat custom hooks query bila perlu
- siapkan mapping dari respons backend ke kebutuhan UI

Kriteria selesai:

- request data utama berhasil
- state loading dan error dapat dipantau
- bentuk data frontend konsisten lintas halaman

### Fase 4: Dashboard pembuka

Tujuan:

- membangun halaman pertama yang kuat untuk presentasi

Pekerjaan:

- buat hero panel `EcoRoute`
- tampilkan KPI utama
- tampilkan progress target reduksi `15-20%`
- tampilkan ringkasan top driver
- tampilkan preview notifikasi
- tambahkan tombol `Run Demo`

Kriteria selesai:

- dashboard dapat dipahami cepat saat dibuka
- data tidak kosong ketika backend aktif
- `Run Demo` mengarahkan ke simulator

### Fase 5: Route Simulator

Tujuan:

- membangun fitur inti demo

Pekerjaan:

- buat form pemilihan driver, origin, stop, dan speed
- implementasi skenario preset untuk `Run Demo`
- kirim simulasi ke endpoint backend
- tampilkan kartu hasil simulasi
- tampilkan warning overspeed

Kriteria selesai:

- simulasi dapat dijalankan end-to-end
- hasil penghematan, poin, dan status eco-driving tampil jelas
- state awal simulator tetap menarik sebelum simulasi dijalankan

### Fase 6: Peta dan urutan stop

Tujuan:

- menampilkan perbandingan visual baseline vs optimized route

Pekerjaan:

- implementasi `RouteMapPanel`
- render marker origin dan stop
- render polyline baseline dan optimized
- buat legenda warna
- implementasi `StopSequencePanel`

Kriteria selesai:

- peta dan panel urutan sinkron dengan hasil simulasi
- perbedaan dua rute langsung terbaca saat demo

### Fase 7: Leaderboard dan Reward Store

Tujuan:

- memperlihatkan loop gamifikasi secara jelas

Pekerjaan:

- buat `LeaderboardPage`
- buat `RewardStorePage`
- tampilkan reward cards dan status poin
- implementasi aksi redeem
- tampilkan modal celebration untuk milestone

Kriteria selesai:

- leaderboard membaca ranking backend
- reward dapat diredeem sesuai syarat poin
- feedback sukses dan gagal tampil jelas

### Fase 8: Analytics dan Notifications

Tujuan:

- memperkuat nilai bisnis dan rasa realtime aplikasi

Pekerjaan:

- buat `AnalyticsPage`
- buat chart penghematan dan tren simulasi
- buat `NotificationsPage`
- tampilkan feed notifikasi dan severity badge
- tampilkan status koneksi realtime

Kriteria selesai:

- analytics menunjukkan dampak kuantitatif yang mudah dibaca
- notifications terasa seperti pusat event operasional

### Fase 9: Integrasi realtime

Tujuan:

- membuat aplikasi terasa aktif dan responsif

Pekerjaan:

- implementasi klien `SSE`
- buat status `Connected`, `Reconnecting`, `Disconnected`
- hubungkan event ke banner, warning, toast, dan modal

Kriteria selesai:

- event backend tercermin di UI yang tepat
- kegagalan koneksi tidak merusak alur aplikasi utama

### Fase 10: Polish dan verifikasi

Tujuan:

- memastikan hasil akhir rapi untuk presentasi

Pekerjaan:

- rapikan spacing, typography, transisi, dan hierarchy
- perkuat loading, empty, dan error states
- cek responsif desktop dan tablet
- lakukan smoke test alur demo utama

Kriteria selesai:

- tampilan terasa premium dan konsisten
- tidak ada blocker visual pada alur presentasi
- halaman utama dan simulator siap ditunjukkan ke mentor

## Struktur file yang akan dibuat

Direktori target:

```text
ecoroute-frontend/
├── src/
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── features/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
```

File inti yang diperkirakan dibuat lebih awal:

- `src/main.tsx`
- `src/App.tsx`
- `src/app/providers.tsx`
- `src/app/router.tsx`
- `src/app/layout/AppShell.tsx`
- `src/app/layout/Sidebar.tsx`
- `src/app/layout/Topbar.tsx`
- `src/styles/tokens.css`
- `src/styles/globals.css`
- `src/services/api-client.ts`
- `src/services/*.api.ts`

## Urutan eksekusi praktis

Urutan kerja yang direkomendasikan saat mulai coding:

1. bootstrap project dan dependensi
2. buat shell, routing, dan styles global
3. sambungkan service API dan query layer
4. bangun dashboard
5. bangun simulator
6. bangun peta dan stop sequence
7. bangun leaderboard dan reward store
8. bangun analytics dan notifications
9. integrasikan `SSE`
10. lakukan polishing dan verifikasi akhir

## Risiko implementasi

### Risiko peta atau data kosong

Mitigasi:

- sediakan initial state yang tetap visual
- tampilkan seed placeholders dari data backend bila belum ada simulasi baru

### Risiko kontrak data backend berbeda dari ekspektasi UI

Mitigasi:

- mulai dari service layer yang tiped
- gunakan adapter mapping di `services` atau `lib`

### Risiko dashboard terlalu ramai

Mitigasi:

- jaga dashboard tetap ringkas
- pindahkan detail berat ke halaman domain masing-masing

### Risiko polishing menghabiskan banyak waktu

Mitigasi:

- selesaikan jalur demo utama terlebih dahulu
- lakukan visual polish setelah fungsi inti stabil

## Validasi akhir

Checklist minimum sebelum frontend dinyatakan siap demo:

- dashboard tampil rapi dan informatif
- `Run Demo` bekerja dari dashboard ke simulator
- simulasi multi-stop berhasil
- peta menampilkan dua rute dengan jelas
- warning overspeed tampil jika speed lebih dari `80 km/jam`
- leaderboard berubah setelah simulasi
- reward redemption memunculkan feedback benar
- analytics dan notifications termuat
- koneksi `SSE` menunjukkan status dengan benar

## Catatan

Plan ini siap menjadi dasar eksekusi implementasi frontend. Setelah plan disetujui, pekerjaan coding dapat dimulai dari bootstrap project lalu bergerak bertahap sesuai fase di atas.
