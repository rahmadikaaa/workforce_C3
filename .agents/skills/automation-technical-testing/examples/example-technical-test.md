# Technical Test Specification

## Automation Information

| Field | Value |
|--------|--------|
| Automation | Bulk Premium Monitoring |
| Version | 1.0 |
| Language | Bash |

---

# 1. Black Box Testing

Mengevaluasi behavior automation dari perspektif input, execution, dan output tanpa bergantung pada detail implementasi internal.

## 1.1 Functional & Execution Test Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-BB-001 | Black Box - Functional | Daily Monitoring Execution | 1. Jalankan script monitoring<br>2. Verifikasi keluaran | Monitoring selesai tanpa error dan laporan terbuat | NOT EXECUTED | NOT TESTED |
| TC-BB-002 | Black Box - Functional | MS Teams Notification | 1. Trigger kondisi notifikasi<br>2. Cek webhook Teams | Notifikasi berhasil dikirim ke channel Teams | NOT EXECUTED | NOT TESTED |

## 1.2 Input & Parameter Validation

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-BB-003 | Black Box - Input | Empty Config Parameter | 1. Kosongkan nilai config<br>2. Jalankan script | Pesan validasi error muncul | NOT EXECUTED | NOT TESTED |
| TC-BB-004 | Black Box - Input | Invalid API Endpoint | 1. Set URL API tidak valid<br>2. Jalankan script | Koneksi terdeteksi gagal dan dilaporkan | NOT EXECUTED | NOT TESTED |

## 1.3 Boundary & Negative Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-BB-005 | Black Box - Boundary | Zero Data Set | 1. Simulasikan data transaksi 0<br>2. Jalankan script | Laporan kosong dihasilkan dengan pesan warning | NOT EXECUTED | NOT TESTED |
| TC-BB-006 | Black Box - Negative | Missing Webhook URL | 1. Hapus MS_TEAMS_WEBHOOK<br>2. Jalankan script | Pengiriman notifikasi dilewati dan error dicatat | NOT EXECUTED | NOT TESTED |

---

# 2. White Box Testing

Mengevaluasi logika internal, control flow, fungsi/komponen internal, parsing data, dan penanganan error berdasarkan implementasi yang tersedia.

## 2.1 Internal Logic & Control Flow

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-WB-001 | White Box - Logic | Success Rate Branching | 1. Input total=100, success=95<br>2. Evaluasi kondisi threshold | Percabangan status `GREEN` dieksekusi | NOT EXECUTED | NOT TESTED |
| TC-WB-002 | White Box - Logic | Error Threshold Trigger | 1. Input error count > MAX_ERROR<br>2. Evaluasi percabangan | Flag `ALERT_TRIGGERED` diset ke 1 | NOT EXECUTED | NOT TESTED |

## 2.2 Component & Parsing Mechanics

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-WB-003 | White Box - Parsing | AWK Log Extractor | 1. Uji fungsi parsing AWK dengan sampel log<br>2. Cek variabel hasil | Nilai MSISDN dan Status Code terekstraksi tepat | NOT EXECUTED | NOT TESTED |
| TC-WB-004 | White Box - Mechanics | Bash Array Aggregation | 1. Masukkan sampel array mentah<br>2. Eksekusi loop agregasi | Array terakumulasi tanpa duplikasi | NOT EXECUTED | NOT TESTED |

## 2.3 Internal Error Handling & Exit Behavior

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
| TC-WB-005 | White Box - Error | API Curl Exit Code Check | 1. Simulasikan exit code curl non-zero<br>2. Cek alur penanganan error | Script melakukan cleanup temp file dan exit with code 1 | NOT EXECUTED | NOT TESTED |