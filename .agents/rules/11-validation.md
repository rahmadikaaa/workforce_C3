# 17. FINAL VALIDATION

Sebelum output:

1. Semua top-level field tersedia.
2. Semua required nested field tersedia.
3. Tidak ada required array kosong tanpa alasan.
4. Semua fakta traceable ke source.
5. Tidak ada informasi yang dikarang.
6. Workflow memiliki `step`, `name`, `description`, `inputs`, `outputs`.
7. Workflow mengikuti actual execution order.
8. Workflow diagram satu baris dengan format `Activity → Activity → Activity`.
9. Credential menggunakan `[REDACTED]`.
10. `sop_steps` hanya berisi aktivitas yang benar-benar dilakukan automation.
11. Tidak ada `sop_steps` yang dibuat hanya untuk menunjukkan aktivitas yang tidak dilakukan.
12. `implemented=false` tidak digunakan sebagai gap analysis.
13. Limitation tidak dibuat hanya karena aktivitas SOP tidak dilakukan.
14. Recommendation tidak dibuat hanya karena aktivitas SOP tidak dilakukan.
15. Business process bukan technical workflow.
16. Technical workflow hanya berdasarkan executable source.
17. Komentar/usage example tidak dianggap executable implementation.
18. Escalation di luar scope tidak masuk `sop_steps`.
19. Seluruh JSON berhasil dirender ke PDF.
20. Tidak ada silent-drop.

Jika PDF hanya berisi heading tanpa isi, OUTPUT = FAILED.

Jika `sop_steps` berisi `implemented=false` hanya untuk menunjukkan aktivitas SOP yang tidak dilakukan tanpa evidence bahwa aktivitas tersebut merupakan scope automation, OUTPUT = FAILED.

---

# FINAL OUTPUT

Source
→ Understand SOP Purpose
→ Identify Automation Scope
→ Identify Actual Automation Activities
→ Generate Analysis JSON
→ Validate
→ Render Complete PDF
→ Validate PDF Completeness
→ OUTPUT = SUCCESS
