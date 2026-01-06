# Pokenime - Anime Streaming Frontend

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**Pokenime** adalah aplikasi web modern untuk streaming anime yang dibangun menggunakan React dan Vite. Proyek ini menawarkan antarmuka pengguna yang bersih, responsif, dan kaya fitur untuk menjelajahi, mencari, dan menonton anime favorit Anda.

## 🚀 Fitur Utama

- **Jelajah Anime**: Temukan anime populer, sedang tayang, dan yang baru saja tamat.
- **Pencarian Canggih**: Cari anime berdasarkan judul dengan hasil yang instan.
- **Filter & Sortir**: Urutkan daftar anime berdasarkan abjad atau waktu rilis.
- **Detail Lengkap**: Informasi mendalam tentang setiap anime termasuk sinopsis, genre, studio, dan daftar episode.
- **Streaming Lancar**: Pemutar video terintegrasi dengan pilihan server dan kualitas resolusi (360p, 480p, 720p, 1080p).
- **Download Episode**: Akses mudah ke link download episode berbagai kualitas.
- **Jadwal Rilis**: Pantau jadwal tayang episode terbaru setiap harinya.
- **Desain Responsif**: Tampilan yang optimal di perangkat desktop, tablet, dan mobile.
- **Tema Gelap**: Antarmuka gelap yang nyaman di mata untuk pengalaman menonton yang lebih baik.

## 🛠️ Teknologi yang Digunakan

- **[React](https://reactjs.org/)**: Library JavaScript untuk membangun antarmuka pengguna.
- **[Vite](https://vitejs.dev/)**: Build tool yang super cepat untuk pengembangan frontend modern.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS utility-first untuk styling yang cepat dan fleksibel.
- **[React Router](https://reactrouter.com/)**: Untuk manajemen navigasi dan routing antar halaman.
- **[Axios](https://axios-http.com/)**: Untuk melakukan request HTTP ke API backend.

## 📦 Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

1.  **Clone Repository**

    ```bash
    git clone https://github.com/username/anime-streaming-frontend.git
    cd anime-streaming-frontend
    ```

2.  **Instal Dependencies**
    Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18+ direkomendasikan).

    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Environment Variable**
    Buat file `.env` di root direktori proyek dan tambahkan URL API backend Anda:

    ```env
    VITE_API_BASE_URL=https://api.example.com/anime
    ```

    _(Catatan: Pastikan endpoint API sesuai dengan struktur yang diharapkan oleh service di `src/services/api.js`)_

4.  **Jalankan Development Server**

    ```bash
    npm run dev
    # atau
    yarn dev
    ```

5.  **Buka di Browser**
    Akses `http://localhost:5173` (atau port yang tertera di terminal) untuk melihat aplikasi.

## 📂 Struktur Folder

```
src/
├── app/                 # Halaman-halaman utama aplikasi
│   ├── (home)/          # Halaman Beranda
│   ├── anime/           # Detail Anime
│   ├── watch/           # Halaman Nonton Episode
│   ├── ongoing/         # Daftar Anime Sedang Tayang
│   ├── completed/       # Daftar Anime Tamat
│   ├── schedule/        # Jadwal Rilis
│   ├── search/          # Halaman Pencarian
│   └── genres/          # Daftar & Detail Genre
├── components/          # Komponen UI yang dapat digunakan kembali
│   ├── AnimeCard.jsx    # Kartu Anime (Grid Item)
│   ├── Navbar.jsx       # Navigasi Atas
│   └── Footer.jsx       # Footer Halaman
├── services/            # Logika komunikasi dengan API
│   └── api.js           # Konfigurasi Axios & Endpoint
├── styles/              # Global CSS & Tailwind Config
└── types/               # Definisi Tipe (jika menggunakan TypeScript)
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1.  Fork repository ini.
2.  Buat branch fitur baru (`git checkout -b fitur-keren`).
3.  Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4.  Push ke branch (`git push origin fitur-keren`).
5.  Buat Pull Request.

## 🌐 Sumber API

Data anime dan streaming pada proyek ini disediakan oleh **[Sankavollerei](https://sankavollerei.com/)**. Terima kasih kepada tim Sankavollerei atas layanan API yang luar biasa.

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 📞 Kontak

Dibuat dengan ❤️ oleh **IzzPrjct**.

- **Instagram**: [@mfzrkhmn\_](https://instagram.com/mfzrkhmn_)
- **Email**: mohfaiz029@gmail.com
