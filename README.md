# Penyelesaian Puzzle Rush Hour

<img src="public/images/rushhour_logo_removebg.png" width="100px" align="left">

### `Tugas Kecil 3 IF2211 Strategi Algoritma`

[![Next.js](https://img.shields.io/badge/Next.js-13.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)](https://www.javascript.com/)

✨ Aplikasi interaktif untuk menyelesaikan puzzle Rush Hour mengimplementasikan berbagai algoritma pathfinding seperti Greedy Best First Search, Uniform Cost Search (UCS), dan A*. Visualisasikan dan bandingkan berbagai strategi pencarian untuk menemukan solusi optimal agar mobil utama bisa keluar dari kemacetan!

<!-- <div>
  <a href="#-instalasi">
    Instalasi
  </a>
  •
  <a href="#-penggunaan">
    Penggunaan
  </a>
  •
  <a href="#-dokumentasi">
    Dokumentasi
  </a>
  •
  <a href="#-fitur">
    Fitur
  </a>
</div> -->

## 📋 Deskripsi

Rush Hour adalah permainan puzzle logika berbasis grid yang menantang pemain untuk menggeser kendaraan di dalam sebuah kotak agar mobil utama (biasanya berwarna merah) dapat keluar dari kemacetan melalui pintu keluar di sisi papan. Proyek ini mengimplementasikan beberapa algoritma pathfinding untuk secara otomatis menyelesaikan puzzle dengan jumlah langkah seminimal mungkin.

Aplikasi ini memiliki fitur:
- Antarmuka GUI berbasis web yang interaktif dibangun dengan Next.js dan React
- Implementasi beberapa algoritma pathfinding (Greedy Best First Search, UCS, A*)
- Berbagai fungsi heuristik untuk memandu pencarian
- Visualisasi langkah-langkah solusi dengan animasi pergerakan
- Analisis performa yang membandingkan efisiensi algoritma

## 🔧 Instalasi

### Prasyarat

- Node.js (v18.0.0 atau lebih tinggi)
- npm (v9.0.0 atau lebih tinggi)

### Setup

1. Clone repository:
```bash
git clone https://github.com/SayyakuHajime/Tucil3_13523009.git
cd Tucil3_13523009
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan server development:
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat aplikasi.

## 💻 Penggunaan

### Antarmuka Web

1. **Halaman Utama**: Memberikan overview aplikasi dengan fitur-fitur:
   - Pengenalan singkat tentang Rush Hour Puzzle dan algoritma yang diimplementasikan
   - Tombol "Start Solving" untuk mengarahkan pengguna ke halaman game
   - Penjelasan singkat tentang keunggulan masing-masing algoritma pathfinding

2. **Halaman Game**: Pusat interaksi untuk menyelesaikan puzzle dengan fitur:
   - **Panel Input Puzzle** - Pilihan multiple untuk input:
     - Upload file konfigurasi (.txt)
     - Visual editor untuk membuat puzzle sendiri
     - Input teks manual dengan format yang ditentukan
   - **Panel Kontrol Algoritma**:
     - Pemilihan algoritma (UCS, Greedy, A*)
     - Pemilihan heuristik untuk Greedy dan A* (Manhattan, Blocking, Combined)
     - Tombol "Solve Puzzle" untuk memulai pencarian solusi
   - **Panel Visualisasi Board**:
     - Tampilan papan interaktif dengan kendaraan berwarna
     - Primary piece dan pintu keluar yang ditandai jelas
     - Animasi pergerakan kendaraan saat menjalankan solusi
   - **Kontrol Navigasi Solusi**:
     - Tombol Previous/Next untuk langkah-per-langkah
     - Indikator langkah saat ini (x dari y)
     - Tombol "Save Solution" untuk mengekspor solusi ke format .txt
   - **Panel Statistik**:
     - Jumlah langkah solusi
     - Jumlah node yang dievaluasi
     - Waktu eksekusi algoritma

3. **Halaman Pembuat**: Informasi tentang pembuat di balik tucil ini

### Format File Input

Program menerima konfigurasi puzzle dalam file teks dengan format berikut:
```
A B       # Dimensi grid AxB
N         # Jumlah kendaraan selain primary piece
[grid]    # Konfigurasi grid
```

Dimana dalam grid:
- `P` mewakili primary piece (kendaraan utama)
- `K` mewakili pintu keluar
- `.` mewakili sel kosong
- Huruf/karakter lain mewakili kendaraan yang berbeda

Contoh:
```
6 6
12
AAB..F
..BCDF
GPPCDFK
GH.III
GHJ...
LLJMM.
```

## 🌟 Fitur

### Algoritma yang Diimplementasikan

- **Greedy Best First Search**: Menggunakan fungsi heuristik untuk memperkirakan jalur terbaik menuju solusi
- **Uniform Cost Search (UCS)**: Mengeksplorasi jalur berdasarkan total biaya dari titik awal
- **A* Search**: Menggabungkan UCS dan evaluasi heuristik untuk pencarian yang efisien
<!-- 
### Heuristik

- **Manhattan Distance**: Memperkirakan jarak antara mobil utama dan pintu keluar
- **Blocking Pieces**: Menghitung jumlah kendaraan yang menghalangi antara mobil utama dan pintu keluar

### Analisis Performa

Program menghasilkan:
- Jumlah state/gerakan yang diperiksa
- Waktu eksekusi
- Jalur menuju solusi dengan langkah minimal
- Visualisasi animasi langkah-langkah solusi

## 📊 Test Case

Direktori `test` berisi beberapa konfigurasi puzzle dengan tingkat kesulitan yang bervariasi:
- Puzzle sederhana dengan sedikit kendaraan
- Puzzle tingkat kesulitan menengah dengan jumlah kendaraan moderat
- Puzzle kompleks dengan banyak kendaraan dalam konfigurasi yang padat -->

## ⚡ Performa

Setiap algoritma memiliki performa yang berbeda tergantung pada konfigurasi puzzle:
- **Greedy**: Paling cepat tetapi mungkin tidak selalu menemukan solusi optimal
- **UCS**: Menjamin solusi optimal tetapi mungkin lebih lambat pada puzzle kompleks
- **A***: Sering memberikan keseimbangan terbaik antara kecepatan dan optimalitas

## Testing


https://github.com/user-attachments/assets/a7894e19-e712-4e45-b261-096f157d955d




## 🔍 Struktur Proyek

```
Tucil3_13523009/
├── README.md              # File ini
├── .gitignore             # File Git ignore
├── package.json           # Dependensi proyek
├── next.config.js         # Konfigurasi Next.js
├── tailwind.config.js     # Konfigurasi Tailwind CSS
├── postcss.config.mjs     # Konfigurasi PostCS 
├── bin/                   # File executable
├── doc/                   # Dokumentasi
├── test/                  # Test case
├── public/                # Aset statis
└── src/                   # Kode sumber
    ├── app/               # Aplikasi Next.js
    ├── components/        # Komponen React
    └── lib/               # Logika inti dan algoritma
    └── utils.js

```

### struktur projek lebih detail bisa dilihat di bawah:

```
src/              
├── app/            
│   ├── page.js     # Home page (homepage)
│   ├── layout.js 
│   ├── globals.css
│   ├── game/       # Game page
│   │   └── page.js
│   └── creator/    # Creator page
│       └── page.js
├── components/     # Reusable UI components
│   ├── Button.js      
│   ├── Typography.js  
│   ├── NavBar.js      
│   └── RushHour/        # Komponen khusus game Rush Hour
│       ├── Board.js     
│       ├── Piece.js     
│       ├── Controls.js 
│       ├── Stats.js   
│       ├── FileInput.js 
│       ├── PuzzleInput.js
│       └── index.js    
└── lib/                # Core logic
    ├── models.js        # Models (Board, Piece, GameState)
    ├── services/
    │   ├── index.js    
    │   └── gameService.js # Core game functionality  
    ├── algorithms/
    │   ├── index.js    
    │   ├── Greedy.js  
    │   ├── UCS.js      
    │   └── AStar.js    
    └── heuristics/
        ├── index.js            
        ├── ManhattanDistance.js
        ├── BlockingPieces.js  
        └── CombinedHeuristic.js
```

## 👨‍💻 Penulis

 <div align="center" id="contributor">
   <strong>
     <h3> Author </h3>
     <table align="center">
       <tr align="center">
         <td>NIM</td>
         <td>Name</td>
         <td>GitHub</td>
       </tr>
       <tr align="center">
         <td>13523009</td>
         <td>M Hazim R Prajoda</td>
         <td><a href="https://github.com/SayyakuHajime">@SayyakuHajime</a></td>
       </tr>
     </table>
   </strong>
 </div>


<div align="center">
<img src="https://github.com/user-attachments/assets/a74c896c-bda1-46e1-b409-cdb473e02fda" width="200px">
</div>

 <div align="center">
 Strategi Algoritma • © 2025 
 </div>