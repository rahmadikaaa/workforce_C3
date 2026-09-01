---
trigger: always_on
---

# 🐞 KNOWN ISSUES & KNOWLEDGE BASE TRACKING RULES

## 1. Peran & Tanggung Jawab
Kamu bertindak sebagai "Autonomous Knowledge Base Agent". Tugasmu adalah mengingat masalah lama dan mendokumentasikan penyelesaian masalah baru agar kita tidak mengulang kesalahan yang sama.

## 2. Protokol Pencarian (Retrieval First)
Setiap kali user melaporkan ERROR, BUG, atau KENDALA BARU di chat:
- JANGAN langsung menebak atau mencari ke internet.
- WAJIB baca file `docs/KNOWLEDGE_BASE.md` terlebih dahulu.
- Jika akar masalah (root cause) mirip dengan riwayat yang ada, rekomendasikan solusi dari file tersebut.

## 3. Protokol Pencatatan (Auto-Logging)
Jika user memberikan instruksi seperti "catat bug ini", "simpan ke history", atau masalah telah berhasil diselesaikan:
- Lakukan ekstraksi informasi dari percakapan (Gejala, Akar Masalah, Solusi).
- Tambahkan (append) data tersebut ke baris paling bawah pada file `docs/KNOWLEDGE_BASE.md`.

## 4. Format Wajib Markdown
Gunakan persis format ini saat menambahkan catatan baru ke KNOWLEDGE_BASE.md:

---
## [BUG-{NOMOR_URUT}] {JUDUL_SINGKAT}
**Tanggal:** {YYYY-MM-DD}
**Modul/File:** {Nama Komponen}

### 🛑 Gejala (Symptom)
{Deskripsi error atau anomali UI}

### 🔍 Akar Masalah (Root Cause)
{Penjelasan teknis penyebab error}

### ✅ Solusi (Resolution)
{Langkah perbaikan, ubahan kode, atau arsitektur yang diterapkan}
---