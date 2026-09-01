# 4. SOP STEPS

`sop_steps` mendokumentasikan aktivitas SOP yang benar-benar dilakukan automation dan relevan dengan tujuan automation.

`sop_steps` BUKAN:
- checklist gap;
- daftar seluruh aktivitas SOP;
- daftar aktivitas yang belum dilakukan;
- daftar limitation;
- daftar recommendation.

Setiap item WAJIB memiliki:

- step
- name
- implemented
- notes

## Penentuan

Gunakan urutan:

1. Pahami tujuan SOP.
2. Identifikasi proses SOP yang relevan.
3. Identifikasi scope automation.
4. Identifikasi aktivitas yang benar-benar dilakukan berdasarkan source.
5. Dokumentasikan aktivitas tersebut.

Mulai dari:

> "Apa yang dilakukan automation untuk mencapai tujuan SOP?"

Bukan:

> "Apa yang belum dilakukan automation?"

## implemented

Gunakan `implemented=true` jika aktivitas yang ditulis benar-benar ditemukan pada source.

JANGAN membuat `implemented=false` hanya untuk menunjukkan aktivitas SOP yang tidak dilakukan.

Aktivitas yang tidak dilakukan, di luar scope, manual, dilakukan pihak lain, escalation di luar automation, atau dilakukan setelah automation tidak perlu dimasukkan ke `sop_steps`.

Jika SOP memiliki aktivitas luas tetapi automation hanya melakukan sebagian, dokumentasikan bagian yang benar-benar dilakukan.

Jangan membuat item untuk bagian yang tidak dilakukan.

Jangan menggunakan `PARTIALLY_COVERED` sebagai daftar gap.

## notes

Jelaskan apa yang dilakukan automation dan hubungannya dengan SOP.

Jangan menjadikan notes sebagai daftar kekurangan.

Jangan menulis "Not Implemented", "Belum Diimplementasikan", atau "Tidak Dilakukan" untuk aktivitas yang memang tidak dimasukkan sebagai `sop_step`.

---
