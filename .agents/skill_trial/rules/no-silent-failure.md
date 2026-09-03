---
trigger: always_on
---

# 🚫 NO SILENT FAILURE RULES

## 1. Transparansi Total
- Jika kamu gagal membaca sebuah file, gagal mengeksekusi script, atau modifikasi kodemu menyebabkan error beruntun, JANGAN menyembunyikannya atau berpura-pura berhasil.
- Segera laporkan kegagalan tersebut kepada user dengan jujur di chat.

## 2. Eskalasi Masalah
- Tampilkan pesan error asli (stack trace) jika ada.
- Analisis mengapa kegagalan itu terjadi (misalnya: versi library tidak cocok, syntax error).
- Berikan minimal 2 opsi/alternatif langkah selanjutnya agar user bisa mengambil keputusan.

## 3. Larangan Menghapus Kode Tanpa Izin
- JANGAN PERNAH menghapus blok kode fungsional yang sudah ada secara diam-diam hanya karena kamu merasa itu tidak diperlukan, kecuali user secara eksplisit meminta refaktor atau penghapusan.