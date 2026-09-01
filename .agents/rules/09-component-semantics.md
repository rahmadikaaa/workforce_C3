# Component Semantic Resolution

Documentation harus menjelaskan fungsi atau peran suatu component dalam konteks automation, bukan sekadar mendeskripsikan nama atau syntax technical component.

Untuk component seperti:
- variable
- runtime parameter
- configuration value
- environment variable
- command argument
- endpoint
- file
- function
- technical identifier
- API parameter
- input
- output
- dependency

gunakan proses:

`Technical Component → Source Usage → Execution Context → Operational Meaning → Documentation`

Jika source dan context mendukung bahwa suatu technical component merepresentasikan object atau concept tertentu dalam proses automation, dokumentasikan object atau concept tersebut beserta perannya dalam proses.

Prioritaskan:

`Represented Object → Role / Function in Process`

daripada:

`Technical Name → Syntax Description`

## Evidence for Operational Meaning

Operational meaning harus ditentukan berdasarkan evidence yang tersedia.

Gunakan konteks dari:

1. executable source
2. source usage dan execution context
3. SOP
4. configuration
5. comments/header
6. documentation

Executable source menjadi dasar untuk menentukan actual implementation.

Usage example, comments, header, dan documentation dapat membantu memahami makna atau konteks component, tetapi bukan bukti bahwa suatu behavior benar-benar dieksekusi.

Jangan membuat operational meaning yang tidak dapat ditelusuri ke evidence.

Jika operational meaning tidak dapat ditentukan:

`Peran operasional tidak dapat ditentukan dari source.`

## Documentation vs Finding

Documentation menjelaskan:
- apa sesuatu itu dalam konteks automation;
- apa yang direpresentasikan;
- apa peran/fungsinya dalam proses.

Finding membahas:
- intended behavior atau requirement;
- actual implementation;
- discrepancy;
- evidence;
- relevansi discrepancy terhadap automation.

Observation mengenai implementation tidak otomatis menjadi finding.

## No Automatic Negative Interpretation

Jangan otomatis mengubah observation berikut menjadi:
- limitation
- knowledge_gap
- recommendation
- requirement automation

Observation yang dimaksud antara lain:
- tidak digunakan
- tidak dipanggil
- tidak ditemukan
- tidak direferensikan
- tidak muncul dalam output
- tidak diimplementasikan

Observation tersebut hanya dapat menjadi finding apabila terdapat evidence dan konteks yang menunjukkan bahwa kondisi tersebut merupakan discrepancy atau issue yang relevan terhadap automation.

## Variable and Parameter Documentation

Untuk variable atau parameter, jangan menjadikan nama teknis sebagai fokus utama apabila operational meaning dapat ditentukan dari source dan context.

Contoh:

Jika:

`INPUT="$1"`

dan automation dijalankan dengan:

`sh automation.sh <trace_id>`

maka dokumentasi sebaiknya menjelaskan **Trace ID sebagai input/konteks operasional automation**, bukan hanya menjelaskan bahwa `$1` merupakan positional parameter.

Namun jangan mengasumsikan fungsi input berdasarkan nama variable saja.

Nama seperti:
- `INPUT`
- `ID`
- `TRACE_ID`
- `DATA`
- `CONFIG`

bukan bukti yang cukup untuk menentukan operational meaning.

Operational meaning harus didukung oleh usage, execution context, SOP, documentation, atau executable behavior.

## Technical Workflow vs Component Documentation

`technical.workflow` menjelaskan **aktivitas yang dilakukan automation dalam execution flow**.

Component documentation menjelaskan **peran component yang digunakan dalam aktivitas tersebut**.

Jangan mencampurkan keduanya.

Contoh:

Workflow activity:

`Memeriksa Failed Decrypt`

Component:

`Trace ID`

Documentation component:

`Identifier yang menjadi konteks transaksi/request yang diperiksa oleh automation.`

Workflow tidak perlu berubah menjadi:

`Memeriksa Failed Decrypt menggunakan variable $1.`

Jika detail tersebut tidak diperlukan untuk menjelaskan aktivitas.
