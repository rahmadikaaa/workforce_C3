---
trigger: always_on
---

# Domain Context Rule

Project "Flow Doc Generator" ini menghasilkan dokumen spesifikasi untuk
automation flow yang melibatkan istilah domain berikut — pahami
konteksnya saat membuat placeholder teks, contoh data, atau penjelasan:

- SLCS, C2P: sistem source data yang dibandingkan/divalidasi satu sama
  lain dalam proses rekonsiliasi data.
- BMC Atrium Orchestrator (disingkat AO): platform orchestration
  automation. "AO" di project ini SELALU merujuk pada ini, bukan
  singkatan lain.
- Splunk: sumber log untuk query transaksi/paket yang gagal.
- Dokumen yang dihasilkan mengikuti struktur Functional Specification
  Design Document: Overview, Flow Description, Process Execution Steps,
  Report Result, Assumptions, Limitations, dan Appendix Error Handling.

Saat membuat contoh/placeholder data JSON untuk testing atau demo, gunakan
konteks domain ini supaya realistis dengan use case sebenarnya (misal
"Check Active Package (C2P)", "Query Splunk IPTV Scheduler") — bukan
data generic seperti "foo/bar/lorem ipsum".