# 10. OUTPUTS

WAJIB memiliki:

- generated_files
- notifications
- reports

Semua bertipe array.

Jika tidak ada data, gunakan placeholder:

- `Automation tidak menghasilkan file.`
- `Automation tidak mengirim notifikasi.`
- `Automation tidak menghasilkan laporan.`

Jangan mengarang output.

Aktivitas manual setelah automation bukan output automation.

---

# 11. SECURITY

WAJIB memiliki:

- credentials
- sensitive_data
- security_considerations

Jangan menampilkan password, token, API key, secret, private key, atau credential value.

Gunakan `[REDACTED]`.

Security finding harus berdasarkan source.

---
