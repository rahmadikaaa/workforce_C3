---
trigger: always_on
---

# 8. INPUTS & DEPENDENCIES

WAJIB memiliki seluruh field yang ditentukan pada struktur JSON.

Hanya masukkan data yang benar-benar ditemukan pada source.

Jangan mengarang input atau dependency.

Jangan menggunakan array kosong jika field membutuhkan data; gunakan placeholder informatif.

`runtime_parameters` hanya berisi parameter yang benar-benar digunakan atau diterima oleh automation.

Komentar atau usage example bukan bukti bahwa parameter digunakan.

---

## 8.1 Documents

`documents` berisi referensi SOP yang diberikan sebagai context untuk activity yang sedang dianalisis.

Link SOP Confluence berbeda untuk setiap activity dan harus menggunakan link yang diberikan pada proses analisis.

Jangan menggunakan placeholder generik seperti:

`"ini merupakan link confluence yang dimuat prompt"`

Gunakan nilai link SOP yang aktual apabila tersedia.

Jika link SOP tidak tersedia dalam source atau input analisis, gunakan placeholder informatif sesuai struktur JSON.

---

## 8.2 Runtime Parameters

`runtime_parameters` harus merepresentasikan parameter operasional yang benar-benar diterima oleh automation.

Jangan menampilkan detail implementasi Bash seperti:

* `$1`
* `$2`
* `$@`
* positional argument
* `shift`

Contoh:

Jika automation dijalankan dengan:

`sh automation.sh <MSISDN>`

dan source membuktikan parameter tersebut digunakan, dokumentasikan sebagai:

```json
{
  "name": "MSISDN",
  "description": "Nomor pelanggan yang menjadi target proses automation."
}
```

Jangan mendokumentasikan:

```text
MSISDN diterima melalui $1
```

Nama parameter harus merepresentasikan makna operasionalnya, bukan mekanisme parsing parameter di source code.

Jika automation tidak menerima runtime parameter, gunakan placeholder informatif sesuai struktur JSON. Jangan menggunakan array kosong jika field wajib membutuhkan nilai.

---

## 8.3 Execution Information

Informasi eksekusi automation harus dipisahkan dari `inputs`.

Gunakan section:

```json
"execution": {
  "command": "...",
  "scheduler": "..."
}
```

### command

Berisi cara automation dijalankan berdasarkan informasi yang diberikan atau ditemukan pada source.

Contoh:

```json
"command": "sh automation.sh <MSISDN>"
```

Jangan mengarang command jika tidak ditemukan.

### scheduler

Berisi jadwal eksekusi automation apabila tersedia.

Contoh:

```json
"scheduler": "*/5 * * * *"
```

Jika scheduler tidak ditemukan dalam source atau informasi input, gunakan placeholder informatif sesuai struktur JSON.

Jangan menyimpulkan bahwa automation berjalan secara scheduler hanya karena automation melakukan monitoring.

---

## 8.4 Deployment Information

Lokasi automation pada server bukan merupakan runtime input.

Lokasi tersebut juga bukan dependency teknis seperti `curl`, `.env`, API, atau external system.

Gunakan section terpisah:

```json
"deployment": {
  "server_path": "/apps/itsmops/myads/checklog_transaction"
}
```

`server_path` merepresentasikan lokasi deployment atau lokasi operational automation di server.

Contoh:

```text
/apps/itsmops/myads/checklog_transaction
```

Jangan memasukkan `server_path` ke:

* `runtime_parameters`
* `configuration_files`
* `tools`
* `external_systems`

Jika lokasi server tidak tersedia, gunakan placeholder informatif sesuai struktur JSON.

---

## 8.5 Configuration Files

`configuration_files` harus dipisahkan dari `inputs`.

Configuration file merupakan dependency apabila file tersebut benar-benar digunakan oleh automation.

Contoh bukti:

```bash
source .env
```

atau:

```bash
source /apps/example/.env
```

Maka:

```json
"configuration_files": [
  ".env"
]
```

Jangan memasukkan file hanya karena file tersebut berada di folder project.

Contoh:

Keberadaan:

```text
.env.example
config.example
README.md
```

bukan bukti file tersebut digunakan oleh automation.

---

## 8.6 Environment Variables

`environment_variables` hanya berisi environment variable yang benar-benar digunakan oleh automation.

Bukti dapat berasal dari:

* referensi variable dalam script
* validasi variable
* penggunaan variable pada command
* penggunaan variable setelah configuration file dimuat

Contoh:

```bash
curl "$SPLUNK_URL"
```

Maka:

```json
"environment_variables": [
  "SPLUNK_URL"
]
```

Jangan menambahkan environment variable hanya karena variable tersebut terdapat dalam `.env.example` tetapi tidak digunakan oleh automation.

---

## 8.7 Dependencies

`dependencies` hanya berisi komponen yang benar-benar dibutuhkan atau digunakan oleh automation.

Struktur dependency dapat mencakup:

```json
"dependencies": {
  "configuration_files": [],
  "environment_variables": [],
  "languages": [],
  "tools": [],
  "external_systems": [],
  "apis": []
}
```

Setiap dependency harus memiliki bukti dari source.

Jangan mengarang:

* tool
* API
* external system
* configuration file
* environment variable
* language

berdasarkan asumsi nama aplikasi atau SOP.

---

## 8.8 Source Evidence Principle

Setiap informasi dalam `inputs`, `execution`, `deployment`, dan `dependencies` harus memiliki salah satu sumber berikut:

1. Diberikan langsung sebagai input analisis.
2. Ditemukan dan benar-benar digunakan dalam source code.
3. Ditemukan dalam SOP sebagai bagian dari activity yang dianalisis.

Informasi yang hanya muncul sebagai:

* komentar
* contoh penggunaan
* documentation
* sample configuration
* unused variable
* nama file dalam folder

tidak otomatis dianggap sebagai bukti penggunaan.

---

## 8.9 Separation of Responsibility

Gunakan pemisahan berikut:

```text
INPUTS
└── Apa yang masuk atau dibutuhkan sebagai input operasional automation

EXECUTION
└── Bagaimana automation dijalankan
    ├── command
    └── scheduler

DEPLOYMENT
└── Di mana automation berada atau dideploy
    └── server_path

DEPENDENCIES
└── Apa yang benar-benar dibutuhkan automation agar berjalan
    ├── configuration_files
    ├── environment_variables
    ├── languages
    ├── tools
    ├── external_systems
    └── apis
```

Jangan mencampurkan informasi antar kategori hanya karena seluruh informasi tersebut berasal dari source automation.
