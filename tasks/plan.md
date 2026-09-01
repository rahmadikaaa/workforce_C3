# Implementation Plan: WORKFORCE Milestone 1

## Overview
Transform the existing Personal Gemini Journal scaffolding into the WORKFORCE Analysis Engine. Milestone 1 focus: Activity Context + SOP + Executable Source → Gemini analysis → valid analysis.json → PDF documentation → end-to-end UI flow.

## Architecture Decisions
- Adapt `JournalEntry` and `Dashboard` UI for WORKFORCE analysis workflow.
- Extend `server.ts` to include analysis generation logic using Gemini API, guided by `.agents/rules/`.
- Use a structured JSON for analysis results (`analysis.json`), to be stored in Firestore.
- PDF generation will be implemented as a new feature.

## Task List

### Phase 1: Foundation
- [ ] Task 1: Analyze and extend `types.ts` to support WORKFORCE Analysis Session data structure.
- [ ] Task 2: Create a new UI component for WORKFORCE analysis input (Context, SOP, Script).

### Checkpoint: Foundation
- [ ] UI components exist, types updated.

### Phase 2: Analysis Logic
- [ ] Task 3: Implement Gemini API analysis logic in `server.ts`, ensuring it adheres to `.agents/rules/`.
- [ ] Task 4: Implement validation logic for `analysis.json` based on `.agents/rules/`.

### Checkpoint: Analysis Logic
- [ ] `analysis.json` generated and validated.

### Phase 3: Artifacts & UI Flow
- [ ] Task 5: Implement PDF generation (based on `.agents/rules/10-pdf-rendering.md`).
- [ ] Task 6: Integrate analysis UI flow into `Dashboard.tsx`.

### Checkpoint: End-to-End
- [ ] End-to-end flow works: Input -> Analysis -> JSON -> PDF.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| PDF generation complexity | High | Use a standard library, or render UI as PDF. |
| Validation failure | Med | Adhere strictly to the JSON schema defined in rules. |

## Open Questions
- What PDF generation library should we use (since none are currently in `package.json`)?
