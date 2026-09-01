# 15. PDF RENDERING

`analysis.json` adalah sumber data utama PDF.

SELURUH isi JSON WAJIB dirender.

## Mapping

### 1. BUSINESS CONTEXT
- purpose → 1.1
- scope → 1.2
- sop_steps → 1.3
- business_process → 1.4
- business_rules → 1.5
- assumptions → 1.6
- limitations → 1.7

### 2. INPUTS & DEPENDENCIES
- documents → 2.1
- configuration_files → 2.2
- environment_variables → 2.3
- runtime_parameters → 2.4
- languages → 2.5
- tools → 2.6
- external_systems → 2.7
- apis → 2.8

### 3. TECHNICAL EXECUTION
- workflow_diagram → 3.1
- workflow → 3.2
- calculations → 3.3
- error_handling → 3.4

### 4. OUTPUTS & SECURITY
- generated_files → 4.1
- notifications → 4.2
- reports → 4.3
- credentials → 4.4
- sensitive_data → 4.5
- security_considerations → 4.6
- knowledge_gaps → 4.7
- recommendations → 4.8

---

# 16. PDF RULES

- Jangan hanya menampilkan heading jika data tersedia.
- Seluruh object, nested object, array, dan nested array WAJIB dirender.
- Tidak boleh ada silent-drop.
- Jangan truncate content.
- Konten panjang harus dilanjutkan ke halaman berikutnya.
- Jika tidak ada data, tampilkan placeholder informatif.
- Jika satu field JSON tidak muncul di PDF, output = GAGAL.

## SOP Steps

WAJIB menampilkan:

- Step
- Name
- Implemented
- Notes

## Workflow

WAJIB menampilkan:

- Step
- Name
- Description
- Inputs
- Outputs

Jangan hanya menampilkan jumlah item array.

---
