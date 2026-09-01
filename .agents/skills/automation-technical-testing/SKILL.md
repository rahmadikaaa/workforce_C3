---
name: automation-technical-testing
description: Generate technical test cases from a completed automation analysis.
---

# Automation Technical Testing

## Purpose

Generate structured and comprehensive technical test cases from a completed automation analysis.

This skill transforms a validated `analysis.json` into a technical testing document that can be used by developers, QA engineers, and automation engineers.

---

# Input

Required:

- analysis.json

The analysis must conform to:

templates/analysis.schema.json

---

# Output

technical-test.md

---

# Responsibilities

Generate technical test cases divided into two primary approaches:

### 1. Black Box Testing
Evaluate automation behavior from the perspective of inputs, execution, outputs, boundary conditions, and error handling without relying on internal script mechanics:
- Functional Testing
- Input & Parameter Validation
- Output & Notification Validation
- Boundary & Edge Condition Testing
- Negative & Failure Behavior Testing

### 2. White Box Testing
Evaluate internal implementation logic, component behavior, execution flow, internal validations, and script mechanics based on available implementation details in `analysis.json`:
- Internal Logic & Control Flow
- Parsing & Transformation Mechanics (e.g., AWK, Bash array, regex parsing)
- Internal Error Handling & Exit Codes
- Function & Sub-routine Validation
- Variable Initialization & Environment Setup

---

# Test Case Structure

Every generated test case MUST contain the following 7 standard fields:

1. **Test ID** (e.g., `TC-BB-001`, `TC-WB-001`)
2. **Test Type** (e.g., `Black Box - Functional`, `White Box - Control Flow`)
3. **Scenario / Component** (Scenario name or internal component/function)
4. **Test Steps** (Reproducible step-by-step execution procedure)
5. **Expected Result** (Derived from SoT, SOP, and confirmed implementation)
6. **Actual Result** (Must ALWAYS be default placeholder `NOT EXECUTED`; agent must never assume or generate fictitious results)
7. **Status** (Default: `NOT TESTED`; valid post-execution statuses: `NOT TESTED`, `PASS`, `FAIL`, `BLOCKED`)

---

# Rules

- Use only information available in `analysis.json`.
- Never read the source code directly during test generation (analysis.json serves as the authoritative source).
- Never read the SOP directly during test generation.
- Never invent functionality that does not exist.
- `Actual Result` MUST be set to `NOT EXECUTED` for all generated test cases.
- Default `Status` MUST be `NOT TESTED`. Do NOT automatically set status to `PASS`.
- If information is unavailable, omit the test case or mark it as **Unknown** / **Requires Validation**.

---

# Writing Style

Test cases should be:

- Clear
- Reproducible
- Objective
- Technical
- Actionable

Use Markdown formatting and standard 7-column tables.

---

# Expected Audience

This document is intended for:

- Developers
- QA Engineers
- Automation Engineers
- Technical Reviewers

---

# Out of Scope

This skill does NOT:

- Analyze source code directly
- Analyze SOP directly
- Generate README documentation
- Generate UAT documentation (UAT is Business/Operational Acceptance Testing)
- Generate security reviews
- Modify analysis.json
- Generate fictitious `Actual Result` values