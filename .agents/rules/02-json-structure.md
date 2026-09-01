---
trigger: always_on
---

# 2. JSON STRUCTURE

`analysis.json` WAJIB mengikuti struktur dan hirarki yang telah ditentukan.

WAJIB memiliki seluruh top-level:

- metadata
- business
- inputs
- execution
- deployment
- dependencies
- technical
- outputs
- security
- knowledge_gaps
- recommendations

Jangan menghilangkan required field.

Jika informasi untuk required field tidak tersedia, gunakan placeholder informatif sesuai tipe field.

Jangan menggunakan array kosong hanya untuk memenuhi struktur JSON.

---

## metadata

WAJIB memiliki:

- app_name
- activity_name
- description
- version
- language
- entrypoint
- analysis_timestamp
- document_history

`metadata` berisi informasi identitas dan konteks analisis automation.

Informasi metadata harus berdasarkan source atau context yang diberikan secara eksplisit pada proses analisis.

---

## business

WAJIB memiliki:

- purpose
- scope
- business_process
- sop_steps
- business_rules
- assumptions
- limitations

`business` menjelaskan konteks dan fungsi automation dalam proses bisnis.

Jangan mencampurkan technical execution detail ke dalam `business_process`.

---

## inputs

WAJIB memiliki:

- documents
- runtime_parameters

### documents

Berisi referensi dokumen atau SOP yang menjadi context activity.

Link SOP Confluence dapat berbeda untuk setiap activity.

Gunakan link yang diberikan untuk activity yang sedang dianalisis apabila tersedia.

### runtime_parameters

Berisi parameter yang benar-benar diterima atau digunakan oleh automation.

Dokumentasikan parameter berdasarkan operational meaning apabila dapat ditentukan dari source dan context.

Jangan menggunakan detail implementasi seperti:

- `$1`
- `$2`
- `$@`

sebagai representasi utama parameter operasional.

---

## execution

WAJIB memiliki:

- command
- scheduler

`execution` menjelaskan bagaimana automation dijalankan.

### command

Berisi command atau invocation untuk menjalankan automation.

Command dapat berasal dari:

- context input yang diberikan secara eksplisit;
- executable source;
- documentation yang relevan.

Jangan mengarang command.

### scheduler

Berisi jadwal scheduler apabila tersedia.

Jangan menyimpulkan scheduler hanya berdasarkan sifat automation.

Jika scheduler tidak tersedia, gunakan placeholder informatif.

---

## deployment

WAJIB memiliki:

- server_path

`deployment` menjelaskan lokasi operasional atau deployment automation.

### server_path

Berisi path lokasi automation di server apabila tersedia.

Contoh:

```json
"server_path": "/apps/itsmops/myads/checklog_transaction"