Here are the two governance files created for the repository.

---

### File 1: `docs/HACKATHON_FOUNDATION.md`

```markdown
# WORKFORCE — Hackathon Foundation & Operating Model

**Status:** Final Pre-Development Baseline  
**Purpose:** Single authoritative reference for product identity, hackathon constraints, instruction hierarchy, and brownfield engineering methodology.

---

## 1. Hackathon Mandates & Constraints

WORKFORCE is being submitted to the **Secure Personal Gemini Journal** challenge. The following platform and submission constraints are hard requirements and must be preserved:

### Phase 1 — Security Constitution (AI Studio)
Google AI Studio must be configured with Custom Instructions governing secure coding standards, threat modeling, database/user isolation, secret management, and security review.

### Phase 2 — Core Application Platform Requirements
- **Authentication:** Firebase Authentication.
- **Persistence:** Persistent user data in Cloud Firestore with zero unauthorized cross-user access.
- **AI Interaction:** Multi-turn interaction via Gemini API.
- **Secrets:** API credentials managed strictly via Google Cloud Secret Manager (no hardcoded keys).

### Phase 3 — Original Feature Enhancement
- At least one original feature enhancement beyond the baseline starter application, built using Google AI Studio.

### Submission Constraints
- Production build deployed to **Cloud Run** with a publicly accessible URL.
- Public GitHub/GitLab repository.
- Social post/demo using `#AccelerateAIwithCloudRun`.
- Architecture narrative explaining Firebase, Firestore, Secret Manager, Cloud Run, and Gemini usage.

---

## 2. Decoupling Identity from Starter Scaffolding

- The **Personal Gemini Journal** is a secure starter implementation and reference scaffolding, **not** the product identity of WORKFORCE.
- WORKFORCE does **not** need to become a digital diary, engineer's journal, or process log.
- Existing starter UI/code may be repurposed as interaction scaffolding (auth, persistence, session panels) while replacing journal-specific business logic with the WORKFORCE analysis engine.

---

## 3. Existing WORKFORCE Truth

Existing WORKFORCE is an evidence-grounded workflow analysis system. Its core flow is:

```text
SOP
 +
Bash / Executable Source
 +
Activity Context
        ↓
AI / Gemini Analysis
        ↓
analysis.json
        ↓
Validation
        ↓
Reusable Documentation / Artifacts
```

### Key Domain Principles (`.agents/rules`)
1. **Evidence vs. Context:** Activity Context is not automatically Analysis Evidence. Executable source code is the primary evidence for implementation behavior.
2. **Intent Grounding:** SOP provides intent and business context.
3. **Truth & Uncertainty:** Facts must never be invented. Implementation uncertainty must remain explicit uncertainty.
4. **Execution over Inventory:** Actual execution flow matters more than simple source code inventory.
5. **Sanitization:** Sensitive data must be sanitized prior to processing/export.
6. **Artifact Authority:** Structured `analysis.json` serves as the Source of Truth for downstream artifacts.

---

## 4. Target Product Model

```text
Authenticated User
        ↓
WORKFORCE Analysis Session
        ↓
Provide Activity Context + SOP + Executable Source
        ↓
Gemini-powered Evidence Analysis
        ↓
Structured Analysis (analysis.json)
        ↓
Persisted Private Session (Firestore)
        ↓
Multi-turn Exploration / Review (Gemini API)
        ↓
Reusable Artifact Generation
```

Multi-turn interaction natively exists around the analysis session (e.g., asking Gemini to explain classification reasoning, detail security findings, or clarify uncertainties).

---

## 5. Development Operating Model & Instruction Hierarchy

No lower layer in this hierarchy may silently override a layer above it:

```text
1. Hackathon Requirements     (Hard compliance & architectural boundary)
        ↓
2. HACKATHON_FOUNDATION        (Product identity, scope, and target boundaries)
        ↓
3. WORKFORCE .agents/rules     (Domain methodology: evidence, uncertainty, sanitization)
        ↓
4. WORKFORCE Domain Skills     (Task-specific operational procedures)
        ↓
5. addyosmani/agent-skills     (Engineering lifecycle & quality gates)
        ↓
6. Implementation / Code       (Deployed application logic)
```

---

## 6. Runtime Separation

The distinct roles of instructions across the lifecycle must be maintained:

- **AI Studio Custom Instructions:** Security constitution for development and code generation.
- **`.agents` Rules & Skills:** Domain methodology governing how WORKFORCE analyzes inputs.
- **`addyosmani/agent-skills`:** Software engineering process governing how code is planned, written, and reviewed.
- **Runtime Gemini Contract:** Deployed prompts/system instructions passed to the Gemini API inside the production application.

---

## 7. Brownfield Development Approach

WORKFORCE is a brownfield project. Development must follow this sequence:

```text
Understand Existing System
        ↓
Verify Current State
        ↓
Define Hackathon Delta
        ↓
Plan
        ↓
Build Incrementally
        ↓
Verify
        ↓
Review
        ↓
Ship
```

- Re-use working Firebase, Firestore, Cloud Run, UI, and analysis components whenever evidence shows they work.
- Do not rewrite functional components solely to conform to a new framework.

---

## 8. Security & Data Boundaries for Hackathon MVP

- **User Isolation:** All analysis sessions, inputs, and outputs remain strictly private to the authenticated user via Firestore security rules.
- **Demonstration Data:** Public demos and repository code must use sanitized/synthetic SOPs, scripts, and contexts. Never commit real credentials, internal identifiers, or confidential data.

---

## 9. Unresolved Implementation Decisions

The following remain unresolved design/engineering problems and must **not** be treated as settled facts without deliberate evaluation:

1. Exact mapping of existing WORKFORCE codebase into the repository architecture.
2. Specific choice of Phase 3 original feature enhancement built via Google AI Studio.
3. Final UI layout for inputting SOPs, Bash sources, and rendering `analysis.json`.
4. Exact prompt structure for the Runtime Gemini Contract.
```

---
