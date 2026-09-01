/**
 * General-Purpose Functional Specification Document Templates.
 * Sanitized for WORKFORCE Integration.
 */

export const emptyTemplate = {
  id: "new",
  label: "New Document",
  meta: {
    docTitle: "DOCUMENTATION OF AUTOMATION",
    appName: "",
    activityName: "",
    preparedFor: "Example Client Corporation",
    confidentiality: "CONFIDENTIAL",
    classification: "Internal",
    date: new Date().toISOString().slice(0, 10),
    docId: "",
    companyName: "Example Technology Indonesia",
    companyAddress: "22nd Floor, Example Tower, Jln. Jend. Sudirman Kav. 50, Jakarta 12190, Indonesia",
    companyPhone: "+62 21 555 0100",
    companyFax: "+62 21 555 0101",
    logoText: "LOGO",
    logoImage: "",
    footerImage: "",
    contact: {
      company: "Example Technology Indonesia",
      address: "Example Tower Suite 2201, Jl. Jend. Sudirman, Jakarta 12190 Indonesia",
      phone: "+62 21 555 0100",
      fax: "+62 21 555 0101",
      email: "contact@example.com",
      website: "www.example.com",
    },
    signatureGroups: [
      {
        title: "",
        signatories: [
          { name: "—", role: "Staff - Operations Management" },
          { name: "—", role: "Officer - Operations Management" }
        ]
      },
      {
        title: "",
        signatories: [
          { name: "Sample Lead", role: "Technical Team Lead" },
          { name: "Sample Manager", role: "Operations Manager" }
        ]
      }
    ],
    history: []
  },

  // FSD JSON Schema v3.0.0
  metadata: {
    app_name: "",
    activity_name: "",
    version: "1.0.0",
    language: "Bash / SQL / Java",
    entrypoint: "",
    analysis_timestamp: new Date().toISOString(),
    document_history: []
  },
  business: {
    purpose: "",
    scope: "",
    business_process: [],
    sop_steps: [],
    business_rules: [],
    assumptions: [],
    limitations: []
  },
  inputs: {
    documents: [],
    configuration_files: [],
    environment_variables: [],
    runtime_parameters: []
  },
  execution: {
    command: "",
    scheduler: null
  },
  deployment: {
    server_path: "",
    server_name: "",
    user: ""
  },
  dependencies: {
    languages: [],
    tools: [],
    external_systems: [],
    apis: []
  },
  technical: {
    workflow: [],
    workflow_diagram: "",
    calculations: [],
    error_handling: []
  },
  outputs: {
    generated_files: [],
    notifications: [],
    reports: []
  },
  security: {
    credentials: [],
    sensitive_data: [],
    security_considerations: []
  },
  knowledge_gaps: [],
  recommendations: [],
  evidence_testing: []
};

export function getTemplate() {
  // Deep clone so every new doc gets its own copy
  return JSON.parse(JSON.stringify(emptyTemplate));
}
