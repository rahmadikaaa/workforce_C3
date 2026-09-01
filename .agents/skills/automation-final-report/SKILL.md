---
name: automation-final-report
description: Generate an executive automation assessment from completed automation artifacts.
---

# Automation Final Report

## Purpose

Generate a comprehensive executive summary from a completed automation analysis.

This report consolidates findings from all generated documentation into a concise management-friendly report.

---

# Input

Required:

- analysis.json

Optional:

- README.md
- technical-test.md
- security-review.md
- uat.md

---

# Output

automation-report.md

---

# Responsibilities

Generate:

- Executive Summary
- Automation Overview
- Documentation Status
- Technical Assessment
- Security Summary
- UAT Summary
- Risks
- Recommendations
- Readiness Assessment

---

# Rules

Use analysis.json as the primary source of truth.

Other generated documents should only be used to enrich the report.

Never invent missing information.

---

# Writing Style

Professional.

Concise.

Executive level.

Markdown.

---

# Expected Audience

- Team Lead
- Engineering Manager
- Product Owner
- Auditor
- Stakeholders

---

# Out of Scope

This skill does NOT:

- Analyze source code
- Analyze SOP
- Modify analysis.json
- Generate implementation details
