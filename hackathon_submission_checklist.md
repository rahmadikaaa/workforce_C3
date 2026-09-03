# WORKFORCE Hackathon Submission Checklist

This manual end-to-end testing checklist is designed to verify that the deployed application demonstrates all mandatory hackathon requirements and the WORKFORCE enhancements in a single, repeatable user journey.

## Test Cases

### TC-01: Cloud Run Live Deployment
*   **Hackathon Requirement:** Application must be deployed to Google Cloud Run.
*   **Preconditions:** The application is built and deployed to Cloud Run.
*   **Exact Manual Steps:**
    1. Navigate to the live Cloud Run URL in an incognito browser window.
    2. Wait for the page to load.
*   **Expected Result:** The landing page loads successfully without critical console errors.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshot of the loaded landing page with the `.run.app` URL visible in the address bar.
*   **Severity:** **BLOCKER**

### TC-02: Firebase Authentication
*   **Hackathon Requirement:** Firebase Authentication implementation.
*   **Preconditions:** TC-01 passed. User has a valid Google account.
*   **Exact Manual Steps:**
    1. Click the "Sign In" or "Get Started" button on the landing page.
    2. Complete the Google OAuth popup flow.
*   **Expected Result:** Successful login redirects the user to the Dashboard (`/dashboard`). The user's profile picture or name is visible in the sidebar.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Short video recording of the login flow and redirection to the dashboard.
*   **Severity:** **BLOCKER**

### TC-03: Multi-turn Gemini Conversation (Personal Journal)
*   **Hackathon Requirement:** Multi-turn Gemini conversation.
*   **Preconditions:** User is logged in and on the Dashboard.
*   **Exact Manual Steps:**
    1. Click "New Reflection" to open the Journal Entry view.
    2. Type a prompt (e.g., "I'm planning to automate a log checking process today. What should I consider?").
    3. Send the message and wait for Gemini's response.
    4. Reply to Gemini's response with a follow-up (e.g., "Can you summarize that into 3 bullet points?").
    5. Send the follow-up message.
*   **Expected Result:** Gemini responds to the first prompt, and the second response clearly retains the context of the first prompt.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshot showing the conversation history demonstrating context retention.
*   **Severity:** **BLOCKER**

### TC-04: Firestore Per-User Persistence
*   **Hackathon Requirement:** Firestore per-user persistence and isolation.
*   **Preconditions:** TC-03 passed. A conversation exists in the current session.
*   **Exact Manual Steps:**
    1. Return to the Dashboard.
    2. Verify the new reflection appears in the "Your History" list.
    3. Click the reflection to reopen it.
    4. Refresh the page (F5).
*   **Expected Result:** The conversation history is fully restored from Firestore after the refresh.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Video showing the dashboard list, clicking into the reflection, refreshing the page, and the data persisting.
*   **Severity:** **BLOCKER**

### TC-05: Zero Cross-User Leakage
*   **Hackathon Requirement:** Firestore per-user isolation.
*   **Preconditions:** User A has created an entry (TC-04). User B has a separate Google account.
*   **Exact Manual Steps:**
    1. Sign out as User A.
    2. Sign in as User B.
    3. View the Dashboard.
*   **Expected Result:** User B's dashboard does not show User A's reflection. User B's history is empty (or contains only User B's previous entries).
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshot of User B's empty dashboard immediately after logging out of User A.
*   **Severity:** **BLOCKER**

### TC-06: WORKFORCE SOP + Bash → analysisJson
*   **Hackathon Requirement:** WORKFORCE original enhancement (Core Pipeline).
*   **Preconditions:** Logged in. Have a sample SOP (PDF/DOCX) and a Bash script (.sh) ready.
*   **Exact Manual Steps:**
    1. Navigate to the Analysis Workspace.
    2. Fill in "App Name" and "Activity Name".
    3. Upload the sample SOP document.
    4. Upload the sample Bash script.
    5. Click the "Analyze" button.
*   **Expected Result:** The UI indicates analysis is in progress, and eventually returns a success state without crashing.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Video starting from clicking "Analyze" to the results appearing.
*   **Severity:** **BLOCKER**

### TC-07: analysisJson Validation & Rendering
*   **Hackathon Requirement:** WORKFORCE original enhancement (Structured Output).
*   **Preconditions:** TC-06 passed. Analysis results are displayed.
*   **Exact Manual Steps:**
    1. Expand the "Metadata", "Business", "Inputs", "Execution", and "Technical" section panels.
    2. Review the rendered JSON values.
*   **Expected Result:** All sections render valid JSON data. No sections show "No analysis data yet". The content aligns with the provided SOP and script.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshots of 2-3 expanded, populated sections (e.g., Technical, Security).
*   **Severity:** **HIGH**

### TC-08: WORKFORCE analysisJson → PDF
*   **Hackathon Requirement:** WORKFORCE original enhancement (FSD Generation).
*   **Preconditions:** TC-07 passed.
*   **Exact Manual Steps:**
    1. Click the "Generate PDF" (or equivalent download) button.
    2. Wait for the generation to complete and the download to trigger.
    3. Open the downloaded PDF.
*   **Expected Result:** A well-formatted PDF is downloaded, containing a Cover Page, Document History, and the populated analysis data.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** The generated PDF file itself (attach to submission), plus a screenshot of the open PDF cover page.
*   **Severity:** **BLOCKER**

### TC-09: Gemini Error Handling / Fallback
*   **Hackathon Requirement:** Gemini resilience/fallback behavior.
*   **Preconditions:** Logged in, Analysis Workspace open.
*   **Exact Manual Steps:**
    *(Note: Hard to manually force a 429/503 without load testing, but we test the application's graceful failure).*
    1. Attempt to upload an extremely large SOP or script (e.g., a 10MB text file) that exceeds token limits.
    2. Click Analyze.
*   **Expected Result:** The application should not crash. It should catch the error and display a user-friendly error message (e.g., "The request payload is too large...").
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshot of the graceful error UI.
*   **Severity:** **MEDIUM**

### TC-10: Secret Handling (User Perspective)
*   **Hackathon Requirement:** Secret/API key handling.
*   **Preconditions:** Application is fully loaded in the browser.
*   **Exact Manual Steps:**
    1. Open Browser Developer Tools (F12) -> Network tab.
    2. Perform an analysis request.
    3. Inspect the outgoing request to `/api/analyze` and the response.
    4. View the page source.
*   **Expected Result:** The `GEMINI_API_KEY` is never visible in the Network headers, payloads, or page source. API calls to Gemini happen strictly server-side.
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** Screenshot of the Network tab showing the clean request to your own backend `/api/analyze`, without exposing Google API keys.
*   **Severity:** **BLOCKER**

### TC-11: Application Robustness
*   **Hackathon Requirement:** General UX/Quality.
*   **Preconditions:** Logged in.
*   **Exact Manual Steps:**
    1. Navigate rapidly between Dashboard, Journal Entry, and Analysis Workspace.
    2. Refresh the Analysis Workspace page.
*   **Expected Result:** The navigation works smoothly. Refreshing the Workspace does not crash the app (though it may reset the form state, which is acceptable).
*   **Status:** `[ ] PASS / [ ] FAIL`
*   **Evidence to Capture:** None strictly required, just a sanity check.
*   **Severity:** **LOW**

---

## Submission Go / No-Go Criteria

**Minimum Required PASSes for "GO":**
Before recording your final demo video and submitting, you **MUST** pass the following tests:
*   TC-01 (Cloud Run Deployment)
*   TC-02 (Firebase Login)
*   TC-03 (Multi-turn Gemini)
*   TC-04 (Firestore Persistence)
*   TC-05 (User Isolation)
*   TC-06 (SOP+Bash Analysis)
*   TC-08 (PDF Generation)
*   TC-10 (Secret Handling)

If any of these fail, it is a **NO-GO**. Fix the blocker before submitting.

---

## Evidence Capture Plan

Prepare these specific assets for your hackathon submission package:

1.  **Live URL:** The `https://...run.app` URL.
2.  **Demo Video (Max 3-5 mins):**
    *   Show logging in via Google.
    *   Show typing a prompt in the Journal and getting a multi-turn response.
    *   Show refreshing the page to prove persistence.
    *   Show opening the Analysis Workspace, uploading a SOP and script, and generating the analysis.
    *   Show clicking the PDF download button and opening the resulting file.
3.  **Screenshots:**
    *   The deployed landing page.
    *   The populated JSON panels in the Analysis Workspace.
    *   The Network tab proving API keys are handled server-side.
4.  **Artifacts:**
    *   A sample PDF generated by the application.

---

## Final Result Summary

*   **Total Tests:** 11
*   **Passed:** [   ]
*   **Failed:** [   ]
*   **Blockers Remaining:** [   ]
*   **Final Decision:** `[ GO ] / [ NO-GO ]`
