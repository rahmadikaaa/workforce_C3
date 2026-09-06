# WORKFORCE

> **Understand the SOP. Find the automation gaps. Generate the documentation.**

WORKFORCE is an authenticated AI application that uses Gemini to reconcile operational intent from Standard Operating Procedures (SOPs) with actual automation behavior, identify implementation gaps, preserve analysis results, and generate structured technical documentation.

Built for the **Google Cloud Run AI Challenge**.

---

## The Problem

Automation changes quickly. Documentation often does not.

Scripts are patched, workflows evolve, and production behavior changes over time, while SOPs and technical documentation may still describe an older version of how the automation is supposed to work.

This creates a simple but important question:

> **Does the automation running today still represent what the documentation says it should do?**

WORKFORCE was built to help answer that question.

---

## What WORKFORCE Does

WORKFORCE creates a reconciliation layer between **operational intent** and **automation reality**.

Instead of simply generating documentation from a prompt, WORKFORCE first analyzes the SOP and automation implementation together, identifies differences between them, preserves the structured result, and turns that analysis into reusable technical documentation.

### Core Flow

```text
SOP + Automation Script
          ↓
     Gemini Analysis
          ↓
 Reconciliation & Findings
          ↓
   Firestore Persistence
          ↓
 Technical Documentation
          ↓
          PDF
```

---

## Workflow 1 — Understand & Reconcile

Users provide two sources of information:

- an operational SOP
- the corresponding automation script or automation lifecycle

Gemini analyzes both sides to understand:

- intended operational workflow
- actual automation behavior
- commands and actions
- normal and abnormal conditions
- dependencies
- scheduling context
- technical and operational impact
- discrepancies between documentation and implementation

The objective is not only to explain the script, but to compare:

> **What should happen according to the SOP?**

with:

> **What does the automation actually do?**

This reconciliation workflow is the core capability of WORKFORCE.

```text
SOP
 +
Automation Script
        ↓
      Gemini
        ↓
Structured Reconciliation
        ↓
Findings / Gaps / Workflow
```

---

## Workflow 2 — Preserve & Revisit

A useful AI analysis should not disappear after a single generation.

After an analysis is completed, WORKFORCE stores the structured result in Firestore.

Authenticated users can return to their dashboard, review previous analyses, and reopen saved work.

```text
Analysis Result
      ↓
   Firestore
      ↓
Saved Analyses
      ↓
    Reopen
```

This turns Gemini output into a persistent working artifact rather than a one-time prompt response.

Firestore records are scoped to the authenticated Firebase user.

---

## Workflow 3 — Generate Documentation

Once the automation has been analyzed and reconciled, WORKFORCE can transform the structured findings into technical documentation.

The generated document can include:

- automation context
- workflow information
- technical behavior
- findings
- operational considerations
- structured documentation sections

The result can then be exported as PDF.

```text
Validated Analysis
        ↓
Structured Documentation
        ↓
       PDF
```

This closes the loop between understanding automation and maintaining technical knowledge.

---

## Demo Inputs

To make WORKFORCE easy to review without exposing confidential operational information, the repository includes **sanitized demo artifacts**.

All identifiers, infrastructure values, addresses, names, paths, and operational references in these demo files are synthetic or sanitized.

### Sample SOP

- [Sanitized Service Restart SOP](./REPLACE_WITH_PATH/restart_service_sop_sanitized.pdf)

### Sample Automation Scripts

- [Alert Detection Script](./REPLACE_WITH_PATH/alert_check_demo.sh)
- [Health Check Script](./REPLACE_WITH_PATH/health_check_demo.sh)
- [Restart & Recovery Script](./REPLACE_WITH_PATH/restart_demo.sh)

The Bash files together represent a simplified automation lifecycle:

```text
Alert Detection
      ↓
Health Check
      ↓
Restart / Recovery
      ↓
Recovery Verification
```

These artifacts can be used as safe inputs when reviewing the WORKFORCE analysis workflow.

> Replace `REPLACE_WITH_PATH` with the actual repository folder containing the demo files.

---

## Multi-Turn Gemini Interaction

WORKFORCE also includes an authenticated multi-turn Gemini experience.

A user can establish context in one message and continue with a subsequent request without repeating the entire subject.

Example:

```text
User:
I'm preparing technical documentation for a service restart automation.
The automation is used when a service experiences an issue and needs
to be restored.

User:
Without repeating everything, summarize the purpose of the automation
I mentioned earlier in two sentences.
```

Gemini can retain and use the context established in the earlier turn.

This provides conversational continuity in addition to the main WORKFORCE analysis workflow.

---

## Architecture

```text
User
  ↓
React Frontend
  ↓
Firebase Authentication
  ↓
WORKFORCE Application
  ↓
Google Cloud Run
  ├── Gemini API
  │      ↑
  │ Google Cloud Secret Manager
  │
  └── Firestore
         ↓
    User-isolated
    analysis data
```

---

## Google AI Studio & Gemini

Google AI Studio was used during development to guide Gemini-powered application behavior and define security-focused development instructions.

Gemini provides the AI capabilities used for:

- SOP understanding
- automation script analysis
- reconciliation
- structured findings
- documentation assistance
- multi-turn conversational interaction

The WORKFORCE workflow extends beyond the starter journal experience by applying Gemini to a custom SOP-to-automation reconciliation use case.

---

## Firebase Authentication

WORKFORCE uses **Firebase Authentication** to establish user identity before protected application functionality is accessed.

Authenticated identity is also used as the ownership boundary for persistent Firestore analysis records.

---

## Firestore Persistence & User Isolation

Firestore stores persistent WORKFORCE analysis results.

Analysis documents include the authenticated Firebase UID.

Firestore Security Rules enforce ownership at the database layer.

Example:

```javascript
match /analyses/{analysisId} {
  allow create: if request.auth != null
    && request.resource.data.userId == request.auth.uid;

  allow read: if request.auth != null
    && resource.data.userId == request.auth.uid;
}
```

This means an authenticated user can only create analysis records for their own UID and can only read analysis records belonging to that UID.

User isolation therefore does not rely only on frontend filtering.

---

## Google Cloud Secret Manager

The production Gemini API credential is stored in **Google Cloud Secret Manager**.

Cloud Run retrieves the credential using a secret reference instead of storing the Gemini API key as a plaintext environment variable.

Production configuration:

```text
GEMINI_API_KEY
  valueFrom:
    secretKeyRef:
      key: latest
      name: gemini-api-key
```

This keeps the Gemini credential out of the client-side application and production source configuration.

---

## Security

Security was treated as a core application requirement because operational documentation and automation artifacts may contain sensitive information.

WORKFORCE applies several security controls:

- **Authentication** — Firebase Authentication establishes user identity.
- **User Isolation** — Firestore Security Rules restrict analysis access using the authenticated Firebase UID.
- **Credential Management** — Gemini API credentials are stored in Google Cloud Secret Manager.
- **Server-Side Secret Access** — Cloud Run retrieves the Gemini credential through a Secret Manager reference.
- **Threat Modeling Guidance** — Google AI Studio development instructions include security-focused guidance.
- **Prompt Injection Awareness** — AI Studio instructions consider untrusted input and prompt-injection risks.
- **Cross-User Leakage Prevention** — Firestore access boundaries prevent analysis records from being shared across users.
- **Secret Handling** — application secrets are not intended to be committed to the public repository.

Google AI Studio security instructions also cover areas such as:

- threat modeling
- secure coding
- prompt injection
- cross-user data leakage
- privilege escalation
- secret handling
- authentication and authorization boundaries

---

## Cloud Run Deployment

The production WORKFORCE application is deployed on **Google Cloud Run**.

Cloud Run provides the public production runtime for the authenticated application and Gemini-powered backend.

The challenge deployment label is configured as:

```text
dev-tutorial=cloud-run-ai-challenge
```

### Live Application

[Launch WORKFORCE on Cloud Run](https://reflect-ai-candidate-620658281668.europe-west1.run.app)

---

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/rahmadikaaa/workforce_C3.git
cd workforce_C3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure local environment

Use `.env.example` as a reference for the environment variables required by the application.

```bash
cp .env.example .env
```

Configure the required local Firebase and Gemini development values.

> Local development may use environment variables. The production Cloud Run deployment retrieves the Gemini API credential through Google Cloud Secret Manager.

Do not commit `.env` files containing credentials.

### 4. Start development

```bash
npm run dev
```

### 5. Build

```bash
npm run build
```

---

## Technology Stack

| Area | Technology |
| --- | --- |
| AI Development | Google AI Studio |
| Generative AI | Gemini API |
| Production Runtime | Google Cloud Run |
| Authentication | Firebase Authentication |
| Database | Firestore |
| Secret Management | Google Cloud Secret Manager |
| Frontend | React |
| Documentation Output | PDF generation |

---

## Challenge Evaluation

### Authenticity

WORKFORCE introduces a custom SOP-to-automation reconciliation workflow.

Instead of only generating AI responses, it compares documented operational intent with actual automation behavior and identifies potential gaps between the two.

### Usability

The application provides a connected workflow:

```text
Provide Inputs
    ↓
Analyze
    ↓
Review Findings
    ↓
Save Analysis
    ↓
Reopen
    ↓
Generate Documentation
```

This allows users to move from operational inputs to reusable documentation through one application experience.

### Stability

The authenticated end-to-end workflow is deployed on Google Cloud Run and uses Firestore for persistent analysis storage.

The production workflow covers:

- authentication
- Gemini analysis
- persistence
- retrieval
- document generation

### Security

WORKFORCE uses:

- Firebase Authentication
- user-isolated Firestore Security Rules
- Google Cloud Secret Manager
- server-side Gemini credential access
- security-focused Google AI Studio instructions

These controls establish boundaries around user identity, persistent data, and application credentials.

---

## Production Links

### Live Application

[https://reflect-ai-candidate-620658281668.europe-west1.run.app](https://reflect-ai-candidate-620658281668.europe-west1.run.app)

### Source Code

[https://github.com/rahmadikaaa/workforce_C3](https://github.com/rahmadikaaa/workforce_C3)

### Demo / Walkthrough

[WORKFORCE — Closing the Gap Between Operational Documentation and Automation Reality](REPLACE_WITH_LINKEDIN_ARTICLE_URL)

---

## The Bigger Idea

Automation will continue to evolve faster than static documentation.

WORKFORCE explores how Gemini can become a reconciliation layer between **operational intent** and **automation reality** — helping teams understand what is running, identify what has changed, preserve the findings, and turn those findings back into useful technical documentation.

> **Understand the SOP. Find the automation gaps. Generate the documentation.**

---

Built with **Google AI Studio · Gemini API · Firebase Authentication · Firestore · Google Cloud Secret Manager · Google Cloud Run**

**#AccelerateAIwithCloudRun**