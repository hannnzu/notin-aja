# 📝 Notin-Aja (TaskMaster)

**Notin-Aja** (juga dikenal sebagai *TaskMaster*) adalah aplikasi manajemen tugas dan catatan komprehensif yang dirancang untuk membantu pengguna mengorganisir pekerjaan mereka dengan lebih efisien. Aplikasi ini mengintegrasikan daftar tugas tradisional dengan papan Kanban interaktif, serta dilengkapi dengan sistem autentikasi pengguna yang aman.

---

## ✨ Fitur Utama

- **🔐 Autentikasi Pengguna yang Aman**: Menggunakan Supabase untuk fitur Login, Registrasi, Lupa Password, dan Reset Password. Dilengkapi dengan proteksi rute (Protected Routes) untuk memastikan keamanan data pengguna.
- **📋 Manajemen Tugas (CRUD)**: Buat, baca, perbarui, dan hapus tugas dengan mudah menggunakan antarmuka yang intuitif. Termasuk fitur pengarsipan (Archive) untuk tugas yang sudah selesai.
- **🗂️ Papan Kanban Interaktif**: Visualisasikan alur kerja tugas melalui papan Kanban. Mendukung fitur *Drag-and-Drop* untuk memindahkan status tugas secara mulus (menggunakan `@hello-pangea/dnd`).
- **📊 Dashboard & Statistik**: Pantau ringkasan produktivitas dan status tugas harian secara real-time pada halaman Dashboard.
- **✅ Validasi Form Real-time**: Menggunakan **React Hook Form** yang dipadukan dengan **Zod** untuk memastikan setiap input tugas dan data pengguna tervalidasi dengan benar sebelum diproses.

---

## 🛠️ Struktur Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern yang terstruktur untuk memastikan performa yang cepat, skalabel, dan mudah dipelihara. Berikut adalah rincian *tech stack* yang digunakan:

| Kategori | Teknologi Utama | Deskripsi / Penggunaan |
| :--- | :--- | :--- |
| **Core Framework** | **React 18** | *Library* utama untuk membangun antarmuka pengguna (UI) secara deklaratif. |
| **Build Tool** | **Vite** | *Bundler* modern yang memberikan waktu *build* dan *hot-reload* (HMR) yang sangat cepat. |
| **Routing** | **React Router DOM v7** | Manajemen navigasi dan *routing* aplikasi (SPA). |
| **Styling** | **Tailwind CSS v3** | *Framework CSS utility-first* untuk *styling* cepat. Didukung *plugin* `@tailwindcss/forms` & `container-queries`. |
| **Backend & Auth** | **Supabase** | Backend-as-a-Service (BaaS) untuk manajemen *database* PostgreSQL dan autentikasi pengguna secara *real-time*. |
| **Global State** | **Zustand** | *State management* yang ringan untuk mengelola state global (seperti `useAuthStore` dan `useTaskStore`). |
| **Server State** | **TanStack Query** | *(React Query)* untuk mengambil, menyimpan ( *caching* ), dan mensinkronisasi data *asynchronous* dari Supabase. |
| **Form Handling** | **React Hook Form** | *Library* performa tinggi untuk mengelola *state* dan validasi *form* tanpa me-*render* ulang seluruh komponen. |
| **Schema Validation** | **Zod** | *Library* deklaratif untuk validasi *schema* data (diintegrasikan dengan `@hookform/resolvers`). |
| **Drag & Drop** | **@hello-pangea/dnd** | Solusi *drag-and-drop* yang kuat dan dapat diakses untuk fitur Papan Kanban. |
| **Utilities** | **date-fns** & **uuid** | `date-fns` untuk manipulasi dan format tanggal/waktu. `uuid` untuk menghasilkan ID unik. |
| **Code Quality** | **ESLint** | *Linter* untuk menjaga kualitas dan konsistensi kode standar JavaScript/React. |

---

## 📂 Struktur Direktori

Berikut adalah struktur utama direktori kode sumber (`src/`):

```text
src/
├── assets/         # Aset statis seperti gambar/ikon
├── components/     # Komponen UI yang dapat digunakan kembali (KanbanBoard, TaskItem, dll)
├── layouts/        # Komponen kerangka tata letak (MainLayout, Sidebar, TopNav)
├── lib/            # Konfigurasi library eksternal (misal: inisialisasi supabase.js)
├── pages/          # Komponen halaman (Dashboard, KanbanPage, LoginPage, dll)
├── store/          # Manajemen state global (Zustand stores)
├── utils/          # Fungsi utilitas pembantu (misal: dateUtils.js)
├── App.jsx         # Komponen utama aplikasi & Definisi Routing
└── main.jsx        # Titik masuk utama aplikasi (Entry point)
```

---

## 🚀 Prasyarat & Instalasi Lokal

Untuk menjalankan proyek ini secara lokal, pastikan Anda telah menginstal **Node.js** (versi 18+ direkomendasikan).

1. **Kloning Repositori** (jika ada di Git):
   ```bash
   git clone <url-repo-anda>
   cd notin-aja
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan (Environment Variables)**:
   Buat file `.env.local` di direktori root aplikasi, dan isi dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL="URL_SUPABASE_ANDA"
   VITE_SUPABASE_ANON_KEY="ANON_KEY_SUPABASE_ANDA"
   ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

---

## 🌐 Deployment (Vercel)

Aplikasi ini siap dan sangat optimal untuk di-deploy menggunakan **Vercel**.

1. Hubungkan repositori GitHub/GitLab Anda ke dasbor Vercel.
2. Vercel akan otomatis mendeteksi proyek sebagai **Vite**.
3. Pastikan konfigurasi berikut sudah benar:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (atau `vite build`)
   - **Output Directory**: `dist`
4. **Sangat Penting**: Tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` pada menu **Environment Variables** di pengaturan proyek Vercel sebelum melakukan *Deploy*.
5. Klik **Deploy** dan aplikasi Notin-Aja Anda akan live!
