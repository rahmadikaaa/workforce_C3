---
trigger: always_on
---

---
trigger: always_on
---

# 1. SOURCE OF TRUTH

Semua informasi dalam `analysis.json` harus memiliki dasar yang jelas.

Bedakan dua jenis informasi:

1. `Activity Context`
2. `Analysis Evidence`

Keduanya memiliki fungsi berbeda dan tidak boleh digunakan secara bergantian.

---

# 1.1 ACTIVITY CONTEXT

`Activity Context` adalah informasi yang diberikan secara eksplisit untuk activity yang sedang dianalisis.

Activity Context bukan hasil ekstraksi atau inferensi dari automation source.

Activity Context dapat mencakup:

- nama aplikasi
- nama activity
- link SOP Confluence
- path automation
- command execution
- scheduler

Contoh:

```text
Nama App:
MYADS

Nama Activity:
Check Log Transaction

Link SOP Confluence:
https://confluence.example/sop/check-log-transaction

Path Automation:
/apps/itsmops/myads/checklog_transaction

Command:
sh automation.sh <MSISDN>

Scheduler:
0 */5 * * *
```

Informasi Activity Context digunakan melalui direct mapping.

| Activity Context | Target Field |
|---|---|
| Nama App | `metadata.app_name` |
| Nama Activity | `metadata.activity_name` |
| Link SOP Confluence | `inputs.documents` |
| Command | `execution.command` |
| Scheduler | `execution.scheduler` |
| Path Automation | `deployment.server_path` |

Activity Context hanya boleh digunakan untuk field yang sesuai dengan informasi tersebut.

---

## Activity Context Bukan Analysis Evidence

Activity Context tidak boleh digunakan untuk menyimpulkan perilaku atau implementasi automation.

Contoh:

```text
Command:
sh automation.sh <MSISDN>
```

Command tersebut dapat mengisi:

```json
"execution": {
  "command": "sh automation.sh <MSISDN>"
}
```

Namun command tersebut tidak otomatis membuktikan bahwa `MSISDN` benar-benar digunakan oleh automation.

Untuk menentukan `inputs.runtime_parameters`, harus ada evidence dari executable source.

Automation dapat saja:

- menerima parameter tetapi tidak menggunakannya;
- memiliki usage example yang tidak sesuai implementation;
- memiliki command documentation yang berbeda dengan executable source.

Prinsip:

```text
Activity Context
≠
Analysis Evidence
```

---

## Activity Context Tidak Boleh Menentukan

Informasi berikut tidak boleh disimpulkan hanya dari Activity Context:

- runtime parameter
- configuration file
- environment variable
- language
- tool
- external system
- API
- workflow
- calculation
- error handling
- generated file
- notification
- report
- security implementation
- technical dependency

Contoh:

```text
Path Automation:
/apps/itsmops/myads/checklog_transaction
```

hanya mengisi:

```json
"deployment": {
  "server_path": "/apps/itsmops/myads/checklog_transaction"
}
```

Path tersebut tidak otomatis membuktikan adanya `.env`, `curl`, API, scheduler, atau external system.

---

# 1.2 ANALYSIS EVIDENCE

`Analysis Evidence` digunakan untuk menentukan fakta tentang bagaimana automation benar-benar bekerja.

Analysis Evidence dapat berasal dari:

- executable source code
- SOP
- configuration yang relevan
- documentation yang relevan
- supporting artifact yang relevan

Jangan mengarang informasi untuk melengkapi field JSON.

---

# 1.3 EXECUTABLE SOURCE

Executable source menjadi dasar utama untuk menentukan actual implementation automation.

Dokumentasikan **actual execution flow**, bukan sekadar membuat **source code inventory**.

Jangan mendokumentasikan seluruh function yang ditemukan di codebase. Hanya dokumentasikan function/logic yang **benar-benar dieksekusi** oleh automation. 

Function, logic, atau komponen yang tidak dipanggil, tidak aktif, legacy, atau dead code **harus dikecualikan dari seluruh section dokumentasi**.

Gunakan executable source untuk menentukan:

- aktivitas yang benar-benar dilakukan;
- runtime parameter yang benar-benar digunakan;
- configuration file yang benar-benar dimuat;
- environment variable yang benar-benar digunakan;
- tools yang benar-benar dieksekusi;
- external system yang benar-benar diakses;
- API yang benar-benar digunakan;
- workflow;
- calculation;
- validation;
- error handling;
- generated file;
- notification;
- report;
- security implementation.

Prinsip:

```text
Executable Source
        ↓
Actual Execution
        ↓
Technical Analysis
```

Jangan menentukan actual implementation hanya berdasarkan:

- nama file;
- nama folder;
- command example;
- usage example;
- komentar;
- documentation.

---

# 1.4 SOP

SOP digunakan untuk memahami:

- tujuan activity;
- business purpose;
- scope;
- proses bisnis;
- terminology;
- langkah operasional;
- business rule;
- konteks activity.

SOP digunakan terutama untuk membangun:

- `business.purpose`
- `business.scope`
- `business.business_process`
- `business.sop_steps`
- `business.business_rules`

SOP tidak otomatis membuktikan bahwa seluruh langkah di dalamnya diimplementasikan oleh automation.

Gunakan perbandingan:

```text
SOP Requirement
        vs
Actual Automation Implementation
```

Jangan memaksa automation terlihat sesuai dengan SOP.

---

# 1.5 CONFIGURATION

Configuration hanya digunakan sebagai Analysis Evidence apabila benar-benar relevan dengan automation.

Configuration dapat membantu menentukan:

- configuration file yang digunakan;
- environment variable yang digunakan;
- endpoint;
- credential reference;
- configuration dependency.

Keberadaan file saja tidak cukup.

Contoh:

```text
.env
.env.example
config.example
README.md
```

tidak otomatis menjadi dependency.

Harus ada evidence bahwa automation memuat, membaca, atau menggunakan configuration tersebut.

Contoh:

```bash
source .env
```

dapat menjadi evidence bahwa `.env` digunakan.

Namun seluruh variable di dalam `.env` tidak otomatis menjadi `dependencies.environment_variables`.

Variable harus benar-benar digunakan oleh automation.

---

# 1.6 DOCUMENTATION

Documentation digunakan untuk memahami:

- terminology;
- operational context;
- usage context;
- execution context;
- penjelasan komponen.

Documentation bukan otomatis bukti actual implementation.

Informasi documentation harus dibandingkan dengan executable source apabila digunakan untuk menentukan:

- workflow;
- runtime parameter;
- dependency;
- output;
- error handling;
- implementation behavior.

Contoh:

```text
sh automation.sh <MSISDN>
```

dapat menjadi evidence untuk `execution.command`, tetapi tidak otomatis membuktikan bahwa executable source menggunakan `MSISDN`.

---

# 1.7 SUPPORTING ARTIFACTS

Supporting artifact dapat digunakan apabila relevan terhadap automation.

Contohnya:

- script pendukung;
- scheduler configuration;
- deployment configuration;
- configuration file;
- log artifact;
- output artifact;
- dokumentasi teknis.

Jangan menganggap seluruh file dalam repository atau folder sebagai dependency automation.

---

# 1.8 EVIDENCE RESOLUTION

Gunakan pemisahan berikut:

```text
ACTIVITY CONTEXT
        │
        └── Direct Mapping
                │
                ├── metadata
                ├── inputs.documents
                ├── execution
                └── deployment


ANALYSIS EVIDENCE
        │
        └── Analysis
                │
                ├── business
                ├── inputs.runtime_parameters
                ├── dependencies
                ├── technical
                ├── outputs
                ├── security
                ├── knowledge_gaps
                └── recommendations
```

Jangan menggunakan Activity Context sebagai pengganti Analysis Evidence.

---

# 1.9 SOURCE TRACEABILITY

Gunakan sumber sesuai jenis informasinya.

| Informasi | Sumber Utama |
|---|---|
| `metadata.app_name` | Activity Context |
| `metadata.activity_name` | Activity Context |
| `inputs.documents` | Activity Context atau SOP |
| `execution.command` | Activity Context atau evidence execution |
| `execution.scheduler` | Activity Context atau scheduler configuration |
| `deployment.server_path` | Activity Context atau deployment artifact |
| `inputs.runtime_parameters` | Executable source |
| `dependencies.*` | Evidence penggunaan nyata |
| `technical.*` | Executable source |
| `outputs.*` | Executable source |
| `security.*` | Executable source atau configuration yang digunakan |
| Business purpose dan scope | SOP |
| Business rules | SOP atau executable source |
| Knowledge gaps | Informasi relevan yang tidak dapat dipastikan |
| Recommendations | Finding yang didukung evidence |

---

# 1.10 PARAMETER EVIDENCE

`runtime_parameters` hanya berisi parameter yang benar-benar digunakan atau diterima oleh executable source.

Contoh:

```text
sh automation.sh <MSISDN>
```

tidak cukup untuk langsung memasukkan:

```json
"runtime_parameters": [
  {
    "name": "MSISDN"
  }
]
```

Lakukan pemeriksaan:

```text
Apakah executable source menerima parameter?
        ↓
Apakah parameter benar-benar digunakan?
        ↓
Apakah operational meaning dapat ditentukan?
        ↓
YA → masukkan
TIDAK → jangan masukkan
```

Contoh evidence:

```bash
MSISDN="$1"

curl "...?msisdn=$MSISDN"
```

membuktikan parameter digunakan.

Sedangkan:

```bash
echo "Usage: $0 <MSISDN>"
```

sendiri tidak cukup.

Komentar, usage example, dan command context bukan bukti penggunaan parameter.

---

# 1.11 DEPENDENCY EVIDENCE

Dependency harus berdasarkan penggunaan nyata.

```text
Component ditemukan
        ↓
Apakah benar-benar digunakan?
        ↓
YA → dependency
TIDAK → jangan masukkan
```

Jangan memasukkan dependency hanya karena:

- tersedia dalam folder;
- terdapat dalam `.env.example`;
- disebut dalam documentation;
- disebut dalam komentar.

Contoh:

`curl` menjadi dependency apabila benar-benar dipanggil oleh automation.

`SPLUNK_URL` menjadi environment dependency apabila benar-benar digunakan.

Variable internal yang dihitung di dalam script bukan otomatis environment variable.

---

# 1.12 MISSING INFORMATION

Jika informasi tidak tersedia atau tidak dapat dibuktikan:

- jangan mengarang;
- jangan menggunakan asumsi;
- jangan menyimpulkan berdasarkan nama atau pola umum.

Gunakan placeholder informatif untuk required field.

Gunakan `knowledge_gaps` apabila informasi yang tidak tersedia merupakan gap yang relevan.

Contoh:

```json
"scheduler": "Jadwal scheduler tidak tersedia dalam sumber analisis."
```

---

# 1.13 REFERENCE ANALYSIS.JSON

Reference `analysis.json` hanya digunakan untuk:

- schema;
- struktur;
- hirarki;
- nama field;
- tipe data.

Reference `analysis.json` bukan sumber fakta untuk activity yang sedang dianalisis.

Jangan menyalin parameter, dependency, workflow, output, security finding, atau recommendation tanpa evidence dari activity tersebut.

---

# 1.14 CORE PRINCIPLE

Gunakan model:

```text
ACTIVITY CONTEXT
        │
        └── Direct Field Mapping
                │
                ▼
        Context-Specific Fields


ANALYSIS EVIDENCE
        │
        └── Evidence Analysis
                │
                ▼
        Automation Facts
```

Kemudian:

```text
Context-Specific Fields
        +
Automation Facts
        ↓
analysis.json
```

Jangan melakukan:

```text
Activity Context
        ↓
Asumsi Implementation
        ↓
analysis.json
```

Prinsip utama:

> Activity Context hanya mengisi informasi yang memang diberikan secara langsung.

> Analysis Evidence digunakan untuk menentukan fakta tentang bagaimana automation bekerja.

> Jika sebuah fakta tidak dapat dibuktikan, jangan disimpulkan.