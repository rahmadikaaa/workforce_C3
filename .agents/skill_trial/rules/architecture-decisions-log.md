---
trigger: always_on
---

# .agent/rules/architecture-decisions-log.md

Setiap kali ada keputusan arsitektur besar (ganti library inti, ubah
skema data utama, ubah mekanisme rendering/export), WAJIB catat sebagai
entry baru di `ARCHITECTURE_DECISIONS.md` — mencakup: apa yang dipakai
sebelumnya, kenapa diganti, apa yang dipakai sekarang, dan konsekuensi
yang perlu diketahui developer selanjutnya. Ini terpisah dari
CHANGELOG.md (yang mencatat histori perubahan granular) — file ini
fokus ke keputusan besar dan alasannya (the "why", bukan the "what").