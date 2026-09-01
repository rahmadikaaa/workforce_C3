---
trigger: always_on
---

# Schema Change Guardrail

Jika sebuah task mengharuskan perubahan struktur data JSON utama
(field baru/dihapus/rename di level business, technical, workflow,
outputs, atau struktur step/section manapun):

1. Sebutkan eksplisit ke user SEBELUM eksekusi: "Ini mengubah schema
   JSON, akan berdampak ke file: [daftar file]" — jangan diam-diam
   mengubah schema sebagai bagian dari perubahan lain.
2. Cek dan sebutkan apakah backend (server/db.js atau file database
   lainnya) perlu penyesuaian validasi/migrasi untuk data lama yang
   sudah tersimpan di database, supaya tidak ada dokumen tersimpan yang
   tiba-tiba gagal dibaca setelah schema berubah.
3. Jangan lakukan perubahan schema sebagai "efek samping" dari task
   lain yang sebenarnya tidak memintanya — kalau perubahan schema
   dirasa perlu untuk menyelesaikan task, usulkan dulu ke user secara
   eksplisit, jangan asumsi otomatis disetujui.
4. Setelah schema berubah, cek apakah template/contoh data preset
   (seperti di `templates/templates.js` atau file konfigurasi serupa)
   perlu ikut disesuaikan supaya tidak ada mismatch.