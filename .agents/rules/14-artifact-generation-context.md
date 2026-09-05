---
trigger: always_on
---

# 14 — Artifact Generation Context

## PURPOSE

Aturan ini mengatur proses pembuatan automation artifact berdasarkan `analysis.json` sebagai Source of Truth utama.

Tujuannya adalah menghindari input context yang berulang, memastikan artifact generation tetap berada dalam scope automation yang dipilih, dan mencegah proses artifact generation melakukan analisis ulang.

Artifact generation bersifat **consume and transform**, bukan **re-analyze**.

---

## 1. SOURCE OF TRUTH

`analysis.json` adalah sumber context utama untuk artifact generation.

Agent WAJIB menggunakan informasi yang tersedia di dalam `analysis.json` sebelum meminta input tambahan.

Agent TIDAK BOLEH:

- mengubah
- memperbarui
- menghasilkan ulang
- menimpa
- melakukan analisis ulang terhadap

`analysis.json` selama proses artifact generation.

---

## 2. CONTEXT RESOLUTION

Agent WAJIB memanfaatkan seluruh context yang tersedia di `analysis.json`, termasuk jika tersedia:

- automation metadata
- automation name
- automation path
- execution
- inputs
- outputs
- dependencies
- deployment
- environment
- implementation reference
- SOP reference
- findings
- technical behavior
- business context
- existing gaps
- recommendations

Agent tidak boleh meminta pengguna mengulang informasi yang sudah tersedia atau dapat diturunkan dari `analysis.json`.

Jika `analysis.json` mereferensikan SOP, implementation script, atau file pendukung lainnya, file tersebut hanya digunakan jika diperlukan untuk:

- validasi informasi
- melengkapi context yang benar-benar belum tersedia
- memenuhi requirement dari rule atau skill yang relevan

Source pendukung tidak digunakan untuk melakukan analisis ulang terhadap automation.

---

## 3. NO RE-ANALYSIS

Artifact generation tidak boleh menghasilkan layer analisis baru.

Agent tidak boleh melakukan atau menghasilkan:

- SOP analysis ulang
- implementation analysis ulang
- gap analysis baru
- semantic classification baru
- SOP vs implementation reconciliation baru
- findings baru
- alignment matrix baru

kecuali secara eksplisit diminta oleh user.

Jika findings, gaps, classification, atau recommendations sudah tersedia di `analysis.json`, artifact boleh menggunakan informasi tersebut sebagai context tanpa melakukan penilaian atau klasifikasi ulang.

---

## 4. SCOPE BOUNDARY

Scope artifact generation ditentukan oleh context dan reference yang berasal dari `analysis.json`.

Agent hanya boleh menggunakan:

- automation yang sedang diproses
- file implementation yang direferensikan
- SOP yang direferensikan
- dependency atau resource yang relevan

Agent tidak boleh membaca atau menggunakan automation lain di luar scope tersebut.

---

## 5. RULES & SKILLS

Agent WAJIB:

1. Membaca rules yang relevan dari:

   `.agents/rules/`

2. Mengidentifikasi skills yang relevan dari:

   `.agents/skills/`

3. Menggunakan hanya skill yang diperlukan untuk artifact yang akan dihasilkan.

Rules mengatur batasan dan konsistensi.

Skills mengatur cara menghasilkan artifact.

Rules dan skills tidak boleh digunakan untuk memperluas artifact generation menjadi proses analisis baru.

---

## 6. CURRENT STATE & RECOMMENDED STATE

Jika artifact memerlukan pemisahan kondisi, gunakan:

### CURRENT_STATE

Hanya berdasarkan:

- `analysis.json`
- implementation yang terverifikasi
- SOP atau evidence pendukung yang terkonfirmasi

### RECOMMENDED_STATE

Digunakan untuk:

- improvement
- hardening
- refactoring
- configuration improvement
- logging improvement
- testing improvement

Rekomendasi tidak boleh dianggap sebagai existing implementation.

Agent tidak boleh menciptakan findings atau rekomendasi baru melalui proses re-analysis, kecuali diminta secara eksplisit oleh user.

---

## 7. MISSING INFORMATION

Jika informasi yang dibutuhkan tidak tersedia di `analysis.json` dan tidak dapat diverifikasi dari reference yang tersedia:

Jangan mengarang atau melakukan analisis tambahan hanya untuk mengisi informasi yang kosong.

Gunakan salah satu status berikut sesuai konteks:

- `NOT AVAILABLE`
- `REQUIRES VALIDATION`

---

## 8. OUTPUT

Artifact disimpan pada output directory automation yang direferensikan atau dapat ditentukan dari `analysis.json`.

Jika output directory belum tersedia, agent WAJIB membuat directory tersebut.

Agent tidak boleh menimpa atau mengubah source analysis yang digunakan sebagai Source of Truth.

---

## 9. DEFAULT ARTIFACT GENERATION

Kecuali ditentukan lain oleh prompt atau requirement automation, artifact generation menghasilkan:

- `README.md`
- `technical-test.md`
- `uat.md`

Artifact harus mengikuti rules dan skills yang relevan tanpa mengubah proses generation menjadi tahap analysis baru.

---

## 10. EXECUTION PRINCIPLE

Urutan kerja:

1. Baca `analysis.json`.
2. Resolve seluruh context yang tersedia.
3. Tentukan scope automation.
4. Identifikasi rules yang relevan.
5. Identifikasi skills yang relevan.
6. Gunakan source pendukung hanya jika diperlukan.
7. Jangan melakukan re-analysis.
8. Transform context menjadi artifact yang diminta.
9. Simpan artifact pada output directory.
10. Jangan mengubah `analysis.json`.