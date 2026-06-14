# Desain Perapihan Hero Dashboard EcoRoute

## Ringkasan

Hero utama pada dashboard `EcoRoute` saat ini menampilkan headline besar yang pecah menjadi terlalu banyak baris pada layar lebar. Akibatnya, area kanan hero terlihat terlalu kosong dan komposisi visual terasa kurang seimbang.

Tujuan perubahan ini adalah memperlebar area headline ke kanan tanpa menghilangkan karakter premium dari tipografi utama. Pendekatan yang dipilih adalah tetap mempertahankan headline besar, tetapi mengatur ulang lebar kolom, `max-width`, dan distribusi ruang antara area teks dan area aksi/metrik.

## Tujuan

- Mengurangi line break berlebihan pada headline hero.
- Memanfaatkan ruang kosong kanan dengan lebih proporsional.
- Menjaga CTA dan metrik hero tetap jelas dan rapi.
- Mempertahankan nuansa visual premium pada dashboard.

## Di luar cakupan

- Mengganti copy headline.
- Mendesain ulang seluruh dashboard.
- Mengubah struktur routing atau data layer.

## Pendekatan yang Dipilih

Pendekatan yang dipakai adalah `Lebar ke kanan`.

Artinya:

- area `.hero-copy` diperlebar,
- headline diberi ruang horizontal lebih besar,
- komposisi `.hero-surface` diatur ulang agar kolom kiri lebih dominan,
- area kanan tetap dipertahankan sebagai ruang CTA dan metrik, bukan dihapus.

## Komponen yang Terdampak

- `HeroSurface` di `src/components/ui.tsx`
- `DashboardPage` di `src/pages/DashboardPage.tsx`
- styling hero di `src/styles/globals.css`

## Perubahan Layout

### Struktur hero

Hero tetap memakai dua area utama:

- kiri untuk eyebrow, headline, dan subtitle,
- kanan untuk tombol aksi dan metrik ringkas.

Namun distribusi kolom akan diubah dari komposisi yang terlalu ketat di kiri menjadi komposisi yang lebih lebar untuk headline.

### Headline

Headline akan tetap memakai ukuran besar, tetapi:

- `max-width` diperbesar,
- line-height disesuaikan agar lebih rapat namun tetap elegan,
- lebar kolom headline diperpanjang ke kanan,
- pembungkusan baris menjadi lebih natural.

### Area kanan

Area tombol dan metrik tetap berada di kanan, tetapi:

- disejajarkan lebih proporsional terhadap headline,
- tidak mengambil terlalu banyak lebar kosong,
- tetap mudah dibaca pada layar desktop.

## Aturan Responsif

- Pada desktop lebar, headline mendapat ruang horizontal lebih besar.
- Pada tablet, hero tetap dua kolom selama masih nyaman dibaca.
- Pada mobile, hero tetap turun menjadi satu kolom agar tidak memaksa teks terlalu lebar.

## Risiko dan Mitigasi

### Headline terlalu melebar

Risiko:

- headline bisa terasa terlalu panjang dan kehilangan ritme visual.

Mitigasi:

- gunakan `max-width` yang lebih besar tetapi tetap dibatasi.

### Area kanan menjadi terlalu sempit

Risiko:

- tombol dan metrik terasa terjepit.

Mitigasi:

- distribusi grid diatur agar area kanan tetap cukup untuk CTA dan dua blok metrik.

### Tampilan mobile ikut terdampak

Risiko:

- perubahan desktop dapat merusak layout kecil.

Mitigasi:

- ubah hanya aturan desktop/tablet dan pertahankan fallback responsif yang aman.

## Kriteria Selesai

Perubahan dianggap berhasil jika:

- headline pada dashboard tampil dalam lebih sedikit baris,
- ruang kosong kanan berkurang,
- hero tetap terlihat premium dan seimbang,
- CTA dan metrik tetap rapi di semua breakpoint utama.
