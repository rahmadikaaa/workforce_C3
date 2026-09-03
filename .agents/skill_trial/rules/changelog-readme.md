---
trigger: always_on
---

# Auto-Update Documentation Rule

Setiap kali kamu (agent) melakukan perubahan kode apapun di project ini —
baik itu penambahan fitur baru, perbaikan bug, refactor, atau perubahan
konfigurasi — WAJIB lakukan ini SEBELUM menyelesaikan task, TANPA perlu
diminta secara eksplisit oleh user di prompt:

1. Update `CHANGELOG.md`:
   - Tambahkan entry baru di bagian paling atas (di bawah header utama),
     ikuti format Semantic Versioning yang sudah ada di file ini.
   - Naikkan versi PATCH (x.x.PATCH) untuk bug fix, MINOR (x.MINOR.x)
     untuk fitur baru non-breaking, MAJOR (MAJOR.x.x) untuk breaking change.
   - Sertakan timestamp presisi (jam:menit:detik) sesuai format yang
     sudah dipakai di entry-entry sebelumnya.
   - Tulis ringkas: apa yang berubah, kenapa, file mana yang terdampak.

2. Update `README.md` HANYA JIKA perubahan tersebut mempengaruhi:
   - Cara install/setup project
   - Command yang tersedia (npm scripts, dsb)
   - Struktur folder utama
   - Fitur yang di-highlight di bagian "Fitur Utama"
   Kalau perubahan cuma internal (refactor kecil, fix bug tanpa
   mengubah cara pakai), README.md TIDAK perlu diupdate — cukup
   CHANGELOG.md saja.

3. Jangan tanya konfirmasi ke user untuk langkah update dokumentasi ini —
   lakukan otomatis sebagai bagian dari definition of done setiap task.

4. Jangan modifikasi versi di `package.json` kecuali user secara eksplisit
   minta rilis versi baru.