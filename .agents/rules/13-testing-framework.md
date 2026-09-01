---
trigger: always_on
---

# 13. TESTING FRAMEWORK

Aturan ini mendefinisikan prinsip, struktur, dan standar pengujian pada automation framework.

---

## 13.1 STRUKTUR & KATEGORISASI TESTING

Framework testing dipisahkan secara eksplisit berdasarkan cakupan dan tujuannya:

### 1. Technical Testing
Technical Testing digunakan oleh developer, QA engineer, dan teknikal reviewer untuk memvalidasi keandalan teknis automation.

Technical Testing mencakup dua pendekatan utama:

- **Black Box Testing**: Mengevaluasi behavior automation dari perspektif input, execution, output, boundary conditions, dan error handling tanpa bergantung pada detail implementasi internal script.
- **White Box Testing**: Mengevaluasi logika internal (internal logic), alur eksekusi (control flow), fungsi/komponen internal, validasi internal, parsing data (misal AWK/Bash processing), dan penanganan error berdasarkan implementation yang tersedia pada source code atau `analysis.json`.

### 2. User Acceptance Testing (UAT)
UAT digunakan oleh Business Owner, Operation Team, dan Service Owner untuk menilai penerimaan operasional dan bisnis dari automation.

- **Business / Operational Acceptance Testing**: Berfokus pada apakah hasil, report, notifikasi, kriteria penerimaan, dan proses bisnis automation dapat diterima dari sudut pandang operasional dan bisnis. UAT TIDAK didefinisikan langsung sebagai Black Box Testing teknis dan TIDAK menguji mekanik internal script (White Box).

---

## 13.2 STANDARD TEST CASE SCHEMA

Seluruh pengujian teknis (Technical Testing) dan pengujian penerimaan (UAT) WAJIB menggunakan 7 field standar berikut pada seluruh tabel test case:

1. **Test ID**: Identitas unik test case (contoh: `TC-BB-001`, `TC-WB-001`, `UAT-001`).
2. **Test Type**: Jenis pengujian (contoh: `Black Box - Functional`, `White Box - Logic`, `Business Acceptance`, `Boundary`, `Negative`, `Configuration`).
3. **Scenario / Component**: Nama skenario bisnis, modul, fungsi, atau komponen teknis yang diuji.
4. **Test Steps**: Langkah-langkah eksekusi pengujian yang terstruktur dan dapat direproduksi.
5. **Expected Result**: Hasil yang diharapkan berdasarkan Source of Truth, SOP, dan implementasi terkonfirmasi.
6. **Actual Result**: Hasil pengujian aktual dari eksekusi nyata. Default: `NOT EXECUTED`.
7. **Status**: Status pengujian. Default: `NOT TESTED`.

---

## 13.3 ATURAN ACTUAL RESULT & STATUS DEFAULT

1. **Actual Result Tidak Boleh Digenerate Secara Fiktif**:
   - Agent atau pembuat dokumentasi TIDAK BOLEH mengarang, mengasumsikan, atau memunculkan hasil eksekusi aktual (`Actual Result`) jika pengujian belum benar-benar dijalankan pada lingkungan sistem.
   - Default `Actual Result` pada spesifikasi test case adalah: `NOT EXECUTED` (atau `[Diisi saat pengujian]`).

2. **Status Default Non-PASS**:
   - Default status awal untuk seluruh test case yang baru digenerate adalah: `NOT TESTED`.
   - Status pengujian hanya boleh diubah setelah eksekusi nyata dengan opsi status valid:
     - `NOT TESTED` (Belum diuji / default)
     - `PASS` (Pengujian sukses dan sesuai expected result)
     - `FAIL` (Pengujian gagal atau terjadi penyimpangan)
     - `BLOCKED` (Pengujian terhambat oleh dependensi/isu lingkungan)

---

## 13.4 GROUNDING EXPECTED RESULT

`Expected Result` harus ditentukan berdasarkan:
- `analysis.json` sebagai Source of Truth utama.
- Executable source code dan SOP yang telah terkonfirmasi.
- Perilaku sistem yang terbukti dan observable.

Dilarang merekonstruksi teks log, notifikasi, atau payload fiktif yang tidak didukung bukti fakta.
