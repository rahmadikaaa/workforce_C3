---
name: automation-documentation
description: Generate technical documentation from automation analysis.
---

# Automation Documentation

## Purpose

Generate clear, structured, and maintainable documentation from an automation analysis.

This skill converts a completed analysis into a human-readable README.

---

# Input

Required:

- analysis.json

The analysis must follow:

templates/analysis.schema.json

---

# Output

README.md

---

# Responsibilities

Generate documentation including:

- Overview
- Business Purpose
- Scope
- Technical Workflow
- Inputs
- Outputs
- Dependencies
- Configuration
- Business Rules
- Error Handling
- Security Considerations
- Limitations
- Recommendations

---

# Rules

- Document actual execution flow, not source code inventory.
- Do not document all functions found in the codebase. Only document functions/logic that are actually executed by the automation.
- Exclude uncalled, inactive, legacy, or dead code from all documentation sections.
- Use only information available in analysis.json.
- Never read the source code directly.
- Never read the SOP directly.
- Never invent missing information.
- If information is unavailable, omit the section or display "Unknown".

---

# Writing Style

Documentation should be:

- Clear
- Technical
- Consistent
- Easy to maintain

Use Markdown.

---

# Out of Scope

This skill does NOT:

- Analyze source code
- Analyze SOP
- Generate test cases
- Generate UAT
- Generate security review
- Modify analysis.json