# AGENTS.md — WORKFORCE Developer Agent Guidelines

Welcome, agent. This repository houses **WORKFORCE**, an evidence-grounded automation analysis application built within the architectural boundaries of the Google Cloud Run & Gemini Hackathon.

Before inspecting, writing, or modifying any code, you MUST follow the instructions in this file.

---

## 1. Prime Directive & Hierarchy

You must strictly observe the following instruction hierarchy. Higher layers take absolute precedence over lower layers:

1. **Hackathon Requirements:** Non-negotiable platform constraints (Firebase Auth, Firestore persistence, Secret Manager, Cloud Run deployment, Gemini API, Security Constitution).
2. **`docs/HACKATHON_FOUNDATION.md`:** Product identity, architectural scope, and development boundaries. Read this first!
3. **WORKFORCE `.agents/rules`:** Domain methodology (evidence handling, SOP intent, uncertainty retention, data sanitization, `analysis.json` validation).
4. **WORKFORCE Domain Skills:** Task-specific analytical workflows.
5. **`addyosmani/agent-skills`:** Engineering lifecycle and quality assurance workflows.
6. **Implementation Code:** Executable application logic.

---

## 2. Essential Product Rules

- **Do Not Redefine Identity:** WORKFORCE is an *Evidence-Grounded Automation Analysis Engine*. It is NOT a journal, diary, or process log. The journal starter template is scaffolding, not product identity.
- **Distinguish Facts from Assumptions:** Unresolved architectural decisions must be treated as unresolved design problems, not facts.
- **Brownfield Strategy:** Inspect and verify existing code before altering it. Do not rewrite working components unnecessarily.
- **Data Security:** Maintain strict multi-tenant user isolation. Never hardcode credentials. Never commit confidential SOPs or execution traces to public areas; use sanitized inputs.

---

## 3. Mandatory Development Workflow

Every task assigned to an agent must follow this lifecycle sequence:

```text
1. Understand Existing System (Audit relevant repo files)
        ↓
2. Verify Current State       (Confirm what is actually working)
        ↓
3. Define Hackathon Delta     (Identify exact gaps against target state)
        ↓
4. Plan                       (Formulate minimal, targeted step)
        ↓
5. Build Incrementally        (Execute change without breaking existing logic)
        ↓
6. Verify                     (Validate functionality & security boundaries)
        ↓
7. Review                     (Ensure adherence to foundation & rules)
        ↓
8. Ship                       (Finalize contribution)
```

---

## 4. Agent Operational Instructions

- **Reading Order:** Read `docs/HACKATHON_FOUNDATION.md` before performing any task.
- **Verification Rule:** Never claim a step is complete without concrete evidence (passing tests, verified execution, or visual proof).
- **Runtime Distinction:** Do not confuse AI Studio custom instructions or development `.agents` rules with the production Gemini API contract. Ensure production endpoints explicitly enforce domain analysis logic.
```

---

Both governance documents have been generated and aligned with the accepted operating model. Standing by for the next instruction