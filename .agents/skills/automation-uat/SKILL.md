---
name: automation-uat
description: Generate business-oriented User Acceptance Test scenarios from a completed automation analysis.
---

# Automation UAT

## Purpose

Generate structured User Acceptance Test (UAT) scenarios from a completed automation analysis.

This skill validates exclusively whether documented automation behaviour and outcomes are acceptable from a business and operational perspective.

---

# Input

Required:

- analysis.json

The analysis must conform to:

templates/analysis.schema.json

---

# Output

uat.md

---

# Responsibilities

Generate business-oriented acceptance scenarios covering:

- Business Purpose & Expected Outcome Acceptance
- Operationally Observable Workflow & User Outcomes
- Business Rule & Threshold Validation
- Input & Output Business Acceptance (Reports, Notifications)
- Operational Exception & Business Alerting Behavior

---

# Standard Test Case Schema

Every UAT scenario MUST follow the 7 standard fields across all test tables:

1. **Test ID** (e.g., `UAT-001`, `UAT-002`)
2. **Test Type** (e.g., `Business Acceptance`, `Operational Workflow`, `Business Rule Validation`, `Exception Acceptance`)
3. **Scenario / Component** (Business scenario name or operational business area)
4. **Test Steps** (Business/operational acceptance steps)
5. **Expected Result** (Expected business outcome derived strictly from `analysis.json`)
6. **Actual Result** (Must ALWAYS be default placeholder `NOT EXECUTED`)
7. **Status** (Must ALWAYS be default placeholder `NOT TESTED`)

---

# Strict Boundaries

To maintain clear separation of concerns, UAT MUST NOT:

- Repeat or generate Automation Analysis.
- Create a Classification & Semantic Resolution Matrix.
- Display semantic classifications such as `ALIGNED`, `DIFFERENT_APPROACH`, `PARTIALLY_COVERED`, `RULE_DISCREPANCY`, `NEEDS_VALIDATION`, `NOT_IMPLEMENTED`, or `IMPLEMENTATION_ONLY` in UAT scenarios.
- Perform SOP vs implementation reconciliation.
- Perform technical gap analysis.
- Test internal implementation mechanics, source code, SQL queries, JDBC connections, API calls, curl parameters, Bash logic, Java processes, data parsing, exit codes, or control flows.
- Include security findings, logging limitations, retry mechanisms, log rotation, credential storage, or technical limitations as UAT test cases, unless explicitly defined as an operational/business acceptance requirement by the user.

---

# Domain Boundaries

- **Technical behavior and implementation validation** → `automation-technical-testing`
- **Security, hardening, logging, dependency, and implementation limitation** → Relevant technical/security artifact
- **SOP vs implementation comparison and semantic classification** → `analysis.json`
- **UAT** → ONLY Business / Operational Acceptance (observable outcomes)

---

# Rules

- Use only information available in `analysis.json`.
- Never read source code directly.
- Never read SOP directly.
- Never use README.md, technical-test.md, or security-review.md as evidence.
- Never invent business processes, user workflows, acceptance criteria, or expected results.
- `Actual Result` MUST be set to `NOT EXECUTED` for all generated test cases.
- Default `Status` MUST be `NOT TESTED`. Never automatically set status to `PASS`, `FAIL`, `ACCEPTANCE GAP`, or `REQUIRES VALIDATION`.

---

# Writing Style

The UAT document should be:

- Business-oriented
- Operationally understandable
- Concise
- Objective
- Traceable strictly to `analysis.json`

Use Markdown formatting and standard 7-column tables for test scenarios.

---

# Expected Audience

This document is intended for:

- Business Users
- Operations Teams
- Service Owners
- Product Owners
- UAT Reviewers

---

# Out of Scope

This skill does NOT:

- Analyze source code or SOP
- Perform technical Black Box or White Box unit/integration testing
- Perform security assessment or penetration testing
- Create semantic classification matrices or SOP reconciliation
- Generate technical gap analysis
- Generate README or technical-test.md
- Modify analysis.json
- Generate fictitious `Actual Result` values