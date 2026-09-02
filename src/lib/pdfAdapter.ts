/**
 * Thin Adapter: WORKFORCE analysisJson -> ExportTemplatePDF payload
 *
 * Preserves all 11 top-level keys from WORKFORCE analysisJson and injects
 * sanitized, generic metadata required for the PDF layout (cover page, header/footer, TOC).
 * Contains NO company-specific data or hardcoded credentials.
 */

export interface WorkforceAnalysisJson {
  metadata?: {
    app_name?: string;
    activity_name?: string;
    description?: string;
    version?: string;
    language?: string;
    entrypoint?: string;
    analysis_timestamp?: string;
    document_history?: Array<{
      version?: string;
      author?: string;
      date?: string;
      change_reference?: string;
    }>;
    [key: string]: unknown;
  };
  business?: {
    purpose?: string;
    scope?: string;
    sop_steps?: Array<{
      step?: string | number;
      name?: string;
      implemented?: boolean;
      notes?: string;
    }>;
    business_process?: string[];
    business_rules?: string[];
    assumptions?: string[];
    limitations?: string[];
    [key: string]: unknown;
  };
  inputs?: {
    documents?: string[];
    configuration_files?: string[];
    environment_variables?: string[];
    runtime_parameters?: Array<{ name: string; description: string } | string> | string[];
    [key: string]: unknown;
  };
  execution?: {
    command?: string;
    scheduler?: string | null;
    [key: string]: unknown;
  };
  deployment?: {
    server_path?: string;
    server_name?: string;
    user?: string;
    [key: string]: unknown;
  };
  dependencies?: {
    languages?: string[];
    tools?: string[];
    external_systems?: string[];
    apis?: string[];
    configuration_files?: string[];
    environment_variables?: string[];
    [key: string]: unknown;
  };
  technical?: {
    workflow?: Array<{
      step?: number;
      name?: string;
      description?: string;
      inputs?: string[];
      outputs?: string[];
    }>;
    workflow_diagram?: string;
    calculations?: string[];
    error_handling?: string[];
    [key: string]: unknown;
  };
  outputs?: {
    generated_files?: string[];
    notifications?: string[];
    reports?: string[];
    [key: string]: unknown;
  };
  security?: {
    credentials?: string[];
    sensitive_data?: string[];
    security_considerations?: string[];
    [key: string]: unknown;
  };
  knowledge_gaps?: string[];
  recommendations?: string[];
  evidence_testing?: Array<{
    name?: string;
    image?: string;
    info?: string;
  }>;
  [key: string]: unknown;
}

export interface AdaptedPdfDocument extends WorkforceAnalysisJson {
  meta: {
    docTitle: string;
    appName: string;
    activityName: string;
    preparedFor: string;
    confidentiality: string;
    classification: string;
    date: string;
    docId: string;
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyFax: string;
    logoText: string;
    logoImage: string;
    footerImage: string;
    contact: {
      company: string;
      address: string;
      phone: string;
      fax: string;
      email: string;
      website: string;
    };
    signatureGroups: Array<{
      title: string;
      signatories: Array<{ name: string; role: string }>;
    }>;
    history: Array<{
      version?: string;
      author?: string;
      date?: string;
      change_reference?: string;
    }>;
  };
}


/**
 * Recursively replaces all `null` values with `undefined` in the object tree.
 *
 * Why: @react-pdf/renderer does NOT tolerate `null` as JSX children.
 * When Gemini returns `null` for a field (e.g. `"scheduler": null`), the
 * pattern `field && <Component/>` evaluates to `null` (not `false`),
 * which causes: "Cannot read properties of null (reading 'props')".
 * Replacing `null` → `undefined` makes short-circuit return `undefined`,
 * which react-pdf safely ignores.
 */
function deepNullToUndefined<T>(value: T): T {
  if (value === null) return undefined as unknown as T;
  if (Array.isArray(value)) return value.map(deepNullToUndefined) as unknown as T;
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepNullToUndefined(v)])
    ) as T;
  }
  return value;
}

/**
 * Adapts WORKFORCE analysisJson to the shape expected by ExportTemplatePDF.
 */
export function adaptWorkforceToPdf(analysis: WorkforceAnalysisJson): AdaptedPdfDocument {
  // Sanitize nulls first — Gemini may return null for any optional field,
  // and null children crash @react-pdf/renderer.
  const safe = deepNullToUndefined(analysis);

  const metaObj = safe?.metadata || {};
  const appName = metaObj.app_name?.trim() || "Automation System";
  const activityName = metaObj.activity_name?.trim() || "Operational Flow";
  const rawTimestamp = metaObj.analysis_timestamp || new Date().toISOString();
  const dateStr = rawTimestamp.length >= 10 ? rawTimestamp.slice(0, 10) : rawTimestamp;

  const docHistory = Array.isArray(metaObj.document_history)
    ? metaObj.document_history
    : [];

  // Reconcile configuration_files and environment_variables between inputs & dependencies
  const configFiles = [
    ...(Array.isArray(safe.inputs?.configuration_files) ? safe.inputs.configuration_files : []),
    ...(Array.isArray(safe.dependencies?.configuration_files) ? safe.dependencies.configuration_files : []),
  ].filter((item, index, self) => Boolean(item) && self.indexOf(item) === index);

  const envVars = [
    ...(Array.isArray(safe.inputs?.environment_variables) ? safe.inputs.environment_variables : []),
    ...(Array.isArray(safe.dependencies?.environment_variables) ? safe.dependencies.environment_variables : []),
  ].filter((item, index, self) => Boolean(item) && self.indexOf(item) === index);

  const sanitizedMeta = {
    docTitle: "DOCUMENTATION OF AUTOMATION",
    appName,
    activityName,
    preparedFor: "Operations & Governance Team",
    confidentiality: "CONFIDENTIAL",
    classification: "Internal",
    date: dateStr,
    docId: `DOC-${appName.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase() || "APP"}`,
    companyName: "Enterprise Automation Platform",
    companyAddress: "Engineering & IT Operations",
    companyPhone: "",
    companyFax: "",
    logoText: appName.slice(0, 4).toUpperCase() || "DOC",
    logoImage: "",
    footerImage: "",
    contact: {
      company: "Enterprise Automation Platform",
      address: "Engineering & IT Operations",
      phone: "",
      fax: "",
      email: "operations@example.com",
      website: "https://example.com",
    },
    signatureGroups: [
      {
        title: "Document Verification",
        signatories: [
          { name: "—", role: "Automation Lead" },
          { name: "—", role: "Service Owner" },
        ],
      },
    ],
    history: docHistory,
  };

  return {
    ...safe,
    meta: sanitizedMeta,
    inputs: {
      ...(safe.inputs || {}),
      documents: safe.inputs?.documents || [],
      configuration_files: configFiles,
      environment_variables: envVars,
      runtime_parameters: safe.inputs?.runtime_parameters || [],
    },
  };
}
