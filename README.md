# Attenda

Attenda adalah aplikasi manajemen absensi karyawan berbasis web yang dibangun menggunakan Go dan React. Aplikasi ini memiliki dua jenis akses, yaitu Admin dan Karyawan, dengan fitur absensi dan pengelolaan akun karyawan.

## Fitur

### Karyawan
- Login menggunakan JWT
- Clock in dan clock out
- Status kehadiran otomatis: tepat waktu atau terlambat
- Riwayat absensi pribadi
- Statistik kehadiran
- Informasi profil

### Admin
- Dashboard admin
- Melihat seluruh data absensi karyawan
- Pencarian dan filter data absensi
- Menambah akun karyawan
- Mengaktifkan dan menonaktifkan akun karyawan
- Pembagian hak akses berdasarkan role

## Teknologi

### Backend
- Go
- Echo
- GORM
- MySQL
- JWT

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Motion
- GSAP

## Struktur Proyek

```text
attenda/
├── backend/
│   ├── cmd/
│   ├── config/
│   ├── controllers/
│   ├── dto/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── utils/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── routes/
│
└── README.md
```

## Cara Menjalankan Proyek

### 1. Clone repository

```bash
git clone https://github.com/RafiBakhtiar23/attenda.git
cd attenda
```

### 2. Jalankan backend

Masuk ke folder backend:

```bash
cd backend
```

Install dependency Go:

```bash
go mod download
```

Buat file `.env` berdasarkan `.env.example`, lalu isi konfigurasi database dan JWT:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_db
JWT_SECRET=your_secret_key
```

Jalankan server:

```bash
go run cmd/main.go
```

Backend berjalan di `http://localhost:8080`.

### 3. Jalankan frontend

Buka terminal baru, lalu masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Buat file `.env` berdasarkan `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Author

Rafi Bakhtiar Cahyadi
