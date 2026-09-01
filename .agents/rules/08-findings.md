# 5. BUSINESS RULES

Masukkan hanya aturan bisnis yang benar-benar ditemukan pada source.

Jangan mengarang business rule.

# 6. ASSUMPTIONS

Masukkan kondisi yang harus terpenuhi berdasarkan source.

Jangan menggunakan asumsi model.

# 7. LIMITATIONS

Masukkan hanya batasan yang benar-benar terbukti dan relevan terhadap automation.

Perbedaan SOP vs source TIDAK otomatis menjadi limitation.

Aktivitas SOP di luar scope juga bukan limitation secara otomatis.

---

# 12. KNOWLEDGE GAPS

Berisi informasi yang memang tidak dapat dipastikan dari source.

Jangan menggunakan asumsi.

Jangan otomatis menganggap aktivitas yang tidak ditemukan sebagai knowledge gap.

---

# 13. RECOMMENDATIONS

Setiap item WAJIB memiliki:

- improvement_name
- description

Recommendation harus berdasarkan finding nyata yang didukung source, seperti limitation, security finding, technical finding, atau relevant knowledge gap.

Jangan membuat recommendation hanya karena aktivitas SOP tidak dilakukan.

Jangan otomatis merekomendasikan aktivitas di luar scope, aktivitas manual, atau escalation.

---

# 14. GENERAL RULES

## SOP vs Automation

SOP digunakan untuk memahami tujuan, proses, aktivitas, dan konteks bisnis.

Source code digunakan untuk menentukan implementation, aktivitas, workflow, output, dan error handling aktual.

Jangan memaksa source mengikuti SOP.

Jangan memaksa SOP mengikuti source.

Jangan menganggap setiap perbedaan sebagai gap.

## No Automatic Gap Inference

Tidak adanya aktivitas pada source TIDAK otomatis berarti:
- belum diimplementasikan;
- limitation;
- knowledge gap;
- recommendation;
- requirement automation.

Kesimpulan tersebut hanya boleh dibuat jika ada evidence.

## Comments vs Executable Code

Komentar, header, usage example, dan documentation dapat menjadi konteks, tetapi bukan bukti executable implementation.

Jika fungsi hanya disebut di komentar/usage example dan executable logic tidak ditemukan:
- jangan menyatakan implemented;
- jangan membuat `implemented=false` sebagai `sop_step`;
- jangan otomatis membuat limitation/recommendation.

Jika documentation berbeda dengan executable code, executable code menjadi dasar actual implementation.

## Escalation

Jangan memasukkan escalation ke `sop_steps` jika berada di luar automation.

Jangan membuat recommendation escalation hanya karena escalation ada di SOP.

Jangan menuliskan nama PIC, nama orang, nama tim, atau nama organisasi pada escalation flow maupun output automation.

## Focus

Prioritaskan:

> apa yang automation lakukan

bukan:

> apa yang automation tidak lakukan.

Negative statement hanya boleh digunakan jika diperlukan dan didukung evidence.

---
