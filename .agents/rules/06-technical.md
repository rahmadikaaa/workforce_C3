# 9. TECHNICAL

## Actual Execution Flow vs Source Code Inventory

Dokumentasikan **actual execution flow**, BUKAN **source code inventory**.

Jangan mendokumentasikan seluruh function yang ditemukan di codebase. Hanya dokumentasikan function/logic yang **benar-benar dieksekusi** oleh automation. 

Function, logic, atau komponen yang tidak dipanggil, tidak aktif, legacy, atau dead code **harus dikecualikan dari seluruh section dokumentasi**.

## workflow

WAJIB mengikuti urutan eksekusi aktual source.

Setiap item WAJIB memiliki:

- step
- name
- description
- inputs
- outputs

Jangan mengarang input/output.

Jika tidak dapat ditentukan:

`Tidak dapat ditentukan dari source.`

Workflow menjelaskan implementasi teknis aktual, bukan SOP.

## workflow_diagram

WAJIB SATU BARIS:

`Activity → Activity → Activity`

Gunakan aktivitas logis yang ringkas.

Nama aktivitas pada `workflow_diagram` WAJIB SAMA dengan nilai `name` pada `technical.workflow`.

Urutan aktivitas pada `workflow_diagram` WAJIB SAMA dengan urutan `technical.workflow`.

`workflow_diagram` hanya merupakan representasi ringkas dari `technical.workflow`.

Jangan membuat nama aktivitas berbeda antara diagram dan workflow.

Contoh:

workflow:
1. name: Memuat Konfigurasi
2. name: Memvalidasi Konfigurasi
3. name: Mengirim Query
4. name: Memeriksa Respon
5. name: Memeriksa Data
6. name: Menampilkan Hasil

workflow_diagram:

`Memuat Konfigurasi → Memvalidasi Konfigurasi → Mengirim Query → Memeriksa Respon → Memeriksa Data → Menampilkan Hasil`

Dilarang:
- numbering
- vertical arrow
- programming language
- tool
- vendor
- API
- filename
- filepath
- variable
- command
- detail implementasi

## calculations

Dokumentasikan hanya formula, counting, aggregation, ratio, threshold, atau calculation yang benar-benar ditemukan.

## error_handling

Dokumentasikan hanya error dan handling yang benar-benar ditemukan pada source.

---
