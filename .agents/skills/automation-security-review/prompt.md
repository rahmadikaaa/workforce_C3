---
name: automation-security-review
description: Generate a security review from a completed automation analysis.
---

# Automation Security Review

## Purpose

Generate a structured security assessment from a completed automation analysis.

This skill evaluates potential security risks based on analysis.json and produces a security review document.

---

# Input

Required:

- analysis.json

The analysis must conform to:

templates/analysis.schema.json

---

# Output

security-review.md

---

# Responsibilities

Generate a security assessment covering:

- Authentication
- Authorization
- Credential Management
- Sensitive Data Handling
- Input Validation
- External Dependencies
- Logging & Auditing
- Error Exposure
- Configuration Risks
- Operational Risks

---

# Rules

- Use only information available in analysis.json.
- Never read the source code directly.
- Never read the SOP directly.
- Never invent security issues.
- If information is unavailable, mark the assessment as Unknown.

---

# Writing Style

The review should be:

- Objective
- Technical
- Actionable
- Risk-based

Use Markdown.

---

# Expected Audience

This document is intended for:

- Developers
- Security Engineers
- Technical Reviewers
- Auditors

---

# Out of Scope

This skill does NOT:

- Analyze source code
- Perform penetration testing
- Execute vulnerability scanning
- Generate README
- Generate UAT
- Modify analysis.json

## Security Relevance Grounding Rule

Security Relevance must remain directly grounded in the documented observed condition.

Do not use Security Relevance to introduce new technical facts, attack consequences, control assumptions, or environmental assumptions that are not documented in `analysis.json`.

In particular:

- Do not infer transport encryption properties from an authentication mechanism.
- Do not infer host or file permission behaviour when permissions are undocumented.
- Do not infer that an undocumented security control is absent or ineffective.
- Do not convert `Unknown` into a negative security conclusion.
- Do not infer exploitability, attacker capability, breach impact, or compromise scenarios.
- Do not infer that the absence of documented centralized logging means activities cannot be audited.
- Do not infer protection effectiveness solely from the presence of a documented control.

When `analysis.json` documents only an observed condition, describe the Security Relevance conservatively.

When evidence is insufficient to establish additional security implications, state:

`The security implication cannot be further assessed from analysis.json.`

For `Unknown` findings, Security Relevance should describe what cannot be assessed rather than asserting a negative security condition.