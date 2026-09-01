# 12. OUTPUT SANITIZATION & SENSITIVE DATA REDACTION

Seluruh informasi sensitif dan kredensial WAJIB disamarkan (*redacted*) di SELURUH bagian `analysis.json` tanpa terkecuali.

---

## 12.1 Cakupan Field (Universal Enforcement)

Aturan penyamaran (*redaction*) TIDAK HANYA berlaku untuk section `security.credentials`, melainkan berlaku secara UNIVERSAL untuk seluruh field top-level dan nested di dalam `analysis.json`, termasuk namun tidak terbatas pada:

- `business.assumptions`
- `business.business_rules`
- `business.sop_steps`
- `inputs.runtime_parameters`
- `inputs.documents`
- `execution.command`
- `dependencies.*`
- `technical.workflow`
- `technical.calculations`
- `technical.error_handling`
- `outputs.generated_files`
- `outputs.notifications`
- `outputs.reports`
- `security.credentials`
- `security.sensitive_data`
- `security.security_considerations`
- `knowledge_gaps`
- `recommendations`

---

## 12.2 Kategori Data Sensitif yang Wajib Disamarkan

Nilai-nilai berikut DILARANG keras ditampilkan dalam bentuk plain text dan WAJIB diganti dengan `[REDACTED]`:

1. **Passwords / Passphrases**: Kata sandi database, API password, akun sistem, atau private key.
2. **Usernames / Account IDs**: Username database (misal DB user `PROL1`), username API, atau account ID internal.
3. **API Keys / Tokens / Secrets**: Access tokens, bearer tokens, secret keys, auth tokens.
4. **Chat IDs / Channel Identifiers**: ID channel internal platform komunikasi (misal Microsoft Teams Chat ID `19:xxx@thread.v2`, Telegram Chat ID, Slack Channel ID).
5. **Private Credentials / Passcodes**: Authorization headers, basic auth credentials, sertifikat private.

---

## 12.3 Ketentuan Penggunaan `[REDACTED]`

- Selalu gunakan string `[REDACTED]` persis (case-sensitive) untuk menggantikan nilai sensitif.
- DILARANG membiarkan credential value lolos dalam kutipan deskripsi, catatan SOP, contoh command, narasi asumsi, maupun output notification.
- **Contoh Baik (BENAR)**:
  - `"Chat ID Microsoft Teams ([REDACTED]) aktif dan dapat dijangkau..."`
  - `"Username '[REDACTED]' dan Password '[REDACTED]' ter-hardcode pada file check_ufo.sh."`
- **Contoh Buruk (DILARANG)**:
  - `"Chat ID Microsoft Teams (19:a96ea7f701d24f89a288cf2738261013@thread.v2) aktif..."`
  - `"Oracle Database Credentials: Username 'PROL1' dan Password '[REDACTED]'..."`

---

## 12.4 Mandatory 360-Degree Credential Audit

Sebelum menghasilkan atau menyimpan file `analysis.json`, WAJIB dilakukan pemindaian ulang (*audit scan*) terhadap SELURUH isi dokumen JSON untuk memastikan tidak ada credential value atau identifier sensitif yang tersisa dalam bentuk plain text.
