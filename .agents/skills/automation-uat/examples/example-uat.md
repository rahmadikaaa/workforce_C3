# User Acceptance Test (UAT): Bulk Premium Monitoring

## Document Overview

Dokumen ini mendokumentasikan skenario **User Acceptance Test (UAT)** untuk memvalidasi penerimaan bisnis dan operasional (*Business & Operational Acceptance*) dari automation **Bulk Premium Monitoring**.

- **Aplikasi**: Bulk Premium
- **Nama Aktivitas**: Monitoring Antrian Bulk Premium
- **Target Pengguna / Audience**: Business Users, Operations Teams, Service Owners, Product Owners, UAT Reviewers
- **Sumber Fakta (Source of Truth)**: `analysis.json`

---

## Business Purpose & Expected Outcomes

### Tujuan Bisnis (Business Purpose)
Mengotomatisasi pemantauan antrian order Bulk Premium secara harian dan otomatis untuk memastikan kelancaran pemrosesan transaksi dan mendeteksi anomali antrian secara dini.

### Hasil Bisnis yang Diharapkan (Business Outcomes)
1. Pemantauan antrian order berjalan otomatis sesuai jadwal.
2. Laporan ringkasan status antrian dikirimkan langsung ke channel Microsoft Teams tim operasional.
3. Notifikasi visual khusus diberikan jika jumlah order gagal melebihi ambang batas operasional.

---

## UAT Test Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| `UAT-001` | Business Acceptance | Automated Daily Monitoring Execution | 1. Periksa jadwal otomatis pemantauan.<br>2. Verifikasi pelaksanaan pemantauan harian. | Pemantauan antrian order berjalan otomatis dan memproses data antrian harian. | `NOT EXECUTED` | `NOT TESTED` |
| `UAT-002` | Operational Workflow | Teams Notification Delivery | 1. Amati saluran komunikasi Microsoft Teams operasi.<br>2. Verifikasi penerimaan laporan notifikasi antrian. | Notifikasi laporan pemantauan antrian diterima pada channel Teams tim operasi. | `NOT EXECUTED` | `NOT TESTED` |
| `UAT-003` | Input Acceptance | Operational Runtime Parameter Validation | 1. Jalankan automation dengan masukan parameter operasional yang sesuai.<br>2. Verifikasi penerimaan masukan oleh sistem. | Sistem menerima masukan parameter operasional dan memproses antrian sesuai kriteria. | `NOT EXECUTED` | `NOT TESTED` |
| `UAT-004` | Business Output | Formatted HTML Summary Report Verification | 1. Buka notifikasi laporan antrian di channel Teams.<br>2. Periksa tampilan visual dan ringkasan data. | Laporan disajikan dalam format tabel visual terstruktur yang mudah dibaca oleh tim operasional. | `NOT EXECUTED` | `NOT TESTED` |
| `UAT-005` | Business Rule Validation | Failure Threshold Visual Alerting | 1. Kondisikan terdapat jumlah transaksi gagal melebihi ambang batas (FAILED > 0).<br>2. Amati tampilan notifikasi di Teams. | Transaksi gagal ditandai dengan penanda visual khusus (warna merah) untuk menarik perhatian tim operasi. | `NOT EXECUTED` | `NOT TESTED` |
| `UAT-006` | Exception Acceptance | Operational Downtime Notification | 1. Simulasikan kondisi sumber data transaksi tidak tersedia.<br>2. Periksa penerimaan notifikasi peringatan di Teams. | Notifikasi peringatan status kendala operasional diterima oleh tim operasi. | `NOT EXECUTED` | `NOT TESTED` |

---

## UAT Approval Sign-off

| Role | Name / Reviewer | Status | Date |
|---|---|---|---|
| Business Owner | [Name] | ☐ Pending / ☐ Approved | YYYY-MM-DD |
| Service / Operations Owner | [Name] | ☐ Pending / ☐ Approved | YYYY-MM-DD |
| QA / UAT Lead | [Name] | ☐ Pending / ☐ Approved | YYYY-MM-DD |
