# User Acceptance Test (UAT): {{automation_name}}

## Document Overview

Dokumen ini mendokumentasikan skenario **User Acceptance Test (UAT)** untuk memvalidasi penerimaan bisnis dan operasional (*Business & Operational Acceptance*) dari automation **{{automation_name}}**.

- **Aplikasi**: {{app_name}}
- **Nama Aktivitas**: {{activity_name}}
- **Target Pengguna / Audience**: Business Users, Operations Teams, Service Owners, Product Owners, UAT Reviewers
- **Sumber Fakta (Source of Truth)**: `analysis.json`

---

## Business Purpose & Expected Outcomes

### Tujuan Bisnis (Business Purpose)
{{business_purpose}}

### Hasil Bisnis yang Diharapkan (Business Outcomes)
{{business_outcomes}}

---

## Standard UAT Test Scenarios

Seluruh skenario UAT menggunakan 7 kolom standar berikut:
1. **Test ID**: Identitas unik test case (`UAT-xxx`).
2. **Test Type**: Jenis pengujian penerimaan (`Business Acceptance`, `Operational Workflow`, `Business Rule Validation`, `Exception Acceptance`).
3. **Scenario / Component**: Komponen atau skenario bisnis yang diuji.
4. **Test Steps**: Langkah-langkah penerimaan bisnis yang diuji oleh pengguna operasional.
5. **Expected Result**: Hasil penerimaan bisnis yang diharapkan berdasarkan `analysis.json`.
6. **Actual Result**: Default `NOT EXECUTED` (diisi saat pengujian nyata).
7. **Status**: Default `NOT TESTED`.

---

## UAT Test Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
{{uat_scenarios}}

---

## UAT Approval Sign-off

| Role | Name / Reviewer | Status | Date |
|---|---|---|---|
| Business Owner | {{business_owner}} | ☐ Pending / ☐ Approved | {{approval_date}} |
| Service / Operations Owner | {{operations_owner}} | ☐ Pending / ☐ Approved | {{approval_date}} |
| QA / UAT Lead | {{qa_lead}} | ☐ Pending / ☐ Approved | {{approval_date}} |
