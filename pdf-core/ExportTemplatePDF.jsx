/**
 * ExportTemplatePDF.jsx (Sanitized Reusable PDF Core)
 * Built with @react-pdf/renderer primitives (<Document>, <Page>, <View>, <Text>, <Image>).
 * Renders complete official Functional Specification Design (FSD) PDF documents.
 */
import {
  Document, Page, View, Text, Image, Font, StyleSheet
} from "@react-pdf/renderer";
import CustomWorkflowDiagramPDF from "./CustomWorkflowDiagramPDF";
import { getSectionNumbers } from "./numbering";

// ─── Font Registration ───────────────────────────────────────────────────────
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
    { src: "Helvetica-Oblique", fontStyle: "italic" },
  ],
});

// ─── Color Palette ───────────────────────────────────────────────────────────
const C = {
  sky600: "#0284c7",
  sky700: "#0369a1",
  sky900: "#0c4a6e",
  sky50: "#f0f9ff",
  rose900: "#881337",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",
  white: "#ffffff",
  red100: "#fee2e2",
  red700: "#b91c1c",
  amber100: "#fef3c7",
  amber700: "#b45309",
  blue100: "#dbeafe",
  blue700: "#1d4ed8",
  purple100: "#f3e8ff",
  purple700: "#7e22ce",
  emerald700: "#047857",
  cyan400: "#22d3ee",
};

// ─── StyleSheet ──────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Page
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.gray800,
    paddingTop: 45,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  coverPage: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.gray800,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  // Header / Footer
  headerBar: {
    position: "absolute",
    top: 15,
    left: 40,
    right: 40,
    fontSize: 7,
    color: C.gray400,
    fontStyle: "italic",
    borderBottomWidth: 0.5,
    borderBottomColor: C.gray300,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerBar: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 7,
    color: C.gray400,
    flexDirection: "column",
  },

  // Cover
  coverDocTitle: { fontSize: 9, fontWeight: "bold", letterSpacing: 1.5, color: C.gray500, textTransform: "uppercase" },
  coverClassification: { fontSize: 8, fontWeight: "bold", letterSpacing: 2, color: C.gray500, textTransform: "uppercase", marginBottom: 12 },
  coverAppName: { fontSize: 18, fontWeight: "bold", color: C.rose900, textTransform: "uppercase", letterSpacing: 1, borderBottomWidth: 2, borderBottomColor: C.rose900, paddingBottom: 6, marginBottom: 16 },
  coverMetaRow: { fontSize: 8, color: C.gray700, marginBottom: 4 },
  coverMetaLabel: { color: C.gray500, width: 70 },
  coverMetaValue: { fontWeight: "bold", color: C.gray900 },
  coverCompanyBlock: { alignItems: "center", marginTop: "auto" },
  coverLogo: { backgroundColor: C.cyan400, paddingVertical: 8, paddingHorizontal: 30, borderRadius: 3, marginBottom: 6 },
  coverLogoText: { fontSize: 14, fontWeight: "bold", letterSpacing: 3, color: "#000" },
  coverCompanyName: { fontSize: 8, fontWeight: "bold", color: C.sky900 },
  coverCompanyAddr: { fontSize: 7, color: C.sky900 },

  // Section Titles
  chapterTitle: { fontSize: 13, fontWeight: "bold", color: C.sky600, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: C.gray300, paddingBottom: 3, marginBottom: 12, marginTop: 6 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", color: C.sky600, textTransform: "uppercase", borderBottomWidth: 2, borderBottomColor: C.gray300, paddingBottom: 3, marginBottom: 8 },
  submenuTitle: { fontSize: 9, fontWeight: "bold", color: C.gray800, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 14, marginBottom: 6 },

  // Text
  bodyText: { fontSize: 8, color: C.gray700, lineHeight: 1.5 },
  monoText: { fontSize: 7.5, fontFamily: "Courier" },

  // Bullet list
  bulletRow: { flexDirection: "row", marginBottom: 3, paddingRight: 10 },
  bulletDot: { width: 10, fontSize: 8, color: C.gray700 },
  bulletText: { flex: 1, fontSize: 8, color: C.gray700, lineHeight: 1.4 },

  // Table
  table: { marginBottom: 10 },
  tableHeaderRow: { flexDirection: "row", backgroundColor: C.gray100, borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: C.gray400 },
  tableRow: { flexDirection: "row", borderTopWidth: 0.5, borderLeftWidth: 0.5, borderColor: C.gray400 },
  tableCell: { padding: 5, fontSize: 8, lineHeight: 1.3, borderRightWidth: 0.5, borderRightColor: C.gray400 },
  tableCellLast: { padding: 5, fontSize: 8, lineHeight: 1.3, borderRightWidth: 0.5, borderRightColor: C.gray400 },
  tableHeaderCell: { padding: 5, fontSize: 8, fontWeight: "bold", lineHeight: 1.3, borderRightWidth: 0.5, borderRightColor: C.gray400 },
  tableHeaderCellLast: { padding: 5, fontSize: 8, fontWeight: "bold", lineHeight: 1.3, borderRightWidth: 0.5, borderRightColor: C.gray400 },

  // Approval grid
  approvalGrid: { flexDirection: "row", borderWidth: 0.5, borderColor: C.gray400 },
  approvalCell: { flex: 1, padding: 10, alignItems: "center", justifyContent: "space-between", minHeight: 100, borderRightWidth: 0.5, borderRightColor: C.gray400 },
  approvalCellLast: { flex: 1, padding: 10, alignItems: "center", justifyContent: "space-between", minHeight: 100 },

  // Contact card
  contactCard: { borderWidth: 0.5, borderColor: C.sky600, borderRadius: 3, maxWidth: 250, marginTop: 4 },
  contactCardHeader: { backgroundColor: C.sky600, padding: 6 },
  contactCardBody: { padding: 8 },

  // TOC
  tocRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, paddingRight: 4 },
  tocRowIndented: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2, paddingLeft: 20, paddingRight: 4 },
  tocTitle: { fontSize: 9, fontWeight: "bold", color: C.gray900 },
  tocSubTitle: { fontSize: 8, color: C.gray700 },

  // Section wrapper
  sectionWrap: { marginBottom: 14 },

  // Badge
  badge: { fontSize: 6, paddingVertical: 2, paddingHorizontal: 5, borderRadius: 2, fontWeight: "bold" },
});

// ─── Reusable Sub-Components ─────────────────────────────────────────────────

const PDFHeader = ({ doc }) => (
  <View style={s.headerBar} fixed>
    <Text>{doc.meta?.docTitle || "Documentation of Automation"}</Text>
    {doc.meta?.logoImage ? (
      <Image src={doc.meta.logoImage} style={{ maxHeight: 15, maxWidth: 60, objectFit: 'contain' }} />
    ) : (
      <Text style={{ fontWeight: "bold", fontStyle: "normal" }}>{doc.meta?.logoText || "LOGO"}</Text>
    )}
  </View>
);

const PDFFooter = ({ doc }) => (
  <View style={s.footerBar} fixed render={({ pageNumber, totalPages }) => (
    <View style={{ flexDirection: 'column', width: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text>{doc?.meta?.confidentiality || "CONFIDENTIAL"}</Text>
        <Text>Page {pageNumber} of {totalPages}</Text>
      </View>
      {doc?.meta?.footerImage ? (
        <Image src={doc.meta.footerImage} style={{ width: "100%", height: 4, objectFit: "cover" }} />
      ) : (
        <View style={{ width: "100%", height: 2, backgroundColor: C.sky700 }} />
      )}
    </View>
  )} />
);

const ChapterTitle = ({ children, id, pageMapObj }) => (
  <Text style={s.chapterTitle} minPresenceAhead={100}>
    <Text render={({ pageNumber }) => {
      if (id && pageMapObj) pageMapObj[id] = pageNumber;
      return "";
    }} />
    {children}
  </Text>
);

const SubmenuTitle = ({ children, id, pageMapObj, minPresenceAhead = 100 }) => (
  <Text style={s.submenuTitle} minPresenceAhead={minPresenceAhead}>
    <Text render={({ pageNumber }) => {
      if (id && pageMapObj) pageMapObj[id] = pageNumber;
      return "";
    }} />
    {children}
  </Text>
);

const cleanTextForPdf = (text) => {
  if (text == null) return "";
  const str = typeof text === 'string' ? text : String(text);
  return str.replace(/\u2192/g, '->')
             .replace(/\u2013/g, '-')
             .replace(/\u2014/g, '--')
             .replace(/[\u2018\u2019]/g, "'")
             .replace(/[\u201C\u201D]/g, '"');
};

/**
 * Reusable normalization helper for list-like analysis fields.
 * Safely converts arrays, strings, objects, or null/undefined into a predictable array.
 *
 * - array -> use as-is (filtering null/undefined)
 * - non-empty string -> split by newlines (or wrap single line) into a safe list
 * - null/undefined -> []
 * - unexpected object -> extract array property, numeric-keyed values, or wrap safely
 */
export const normalizeList = (val) => {
  if (val == null) return [];
  if (Array.isArray(val)) {
    return val.filter(item => item !== null && item !== undefined);
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.includes("\n")) {
      const lines = trimmed.split(/\r?\n+/).map(l => l.trim()).filter(Boolean);
      return lines.length > 0 ? lines : [trimmed];
    }
    return [trimmed];
  }
  if (typeof val === "object") {
    for (const key of ["items", "steps", "workflow", "list", "values", "data"]) {
      if (Array.isArray(val[key])) {
        return normalizeList(val[key]);
      }
    }
    const keys = Object.keys(val);
    if (keys.length === 0) return [];
    if (keys.every(k => !isNaN(Number(k)))) {
      return Object.values(val).filter(item => item !== null && item !== undefined);
    }
    return [val];
  }
  return [];
};

/**
 * Normalizes workflow steps so that every step is an object with step, name, and description.
 */
export const normalizeWorkflow = (workflowVal) => {
  const list = normalizeList(workflowVal);
  return list.map((w, i) => {
    if (w && typeof w === "object" && !Array.isArray(w)) {
      const step = w.step != null ? String(w.step) : String(i + 1);
      const name = w.name || w.step_name || w.title || w.action || (typeof w.description === "string" && w.description ? w.description : `Step ${i + 1}`);
      const description = (w.description && w.description !== name) ? String(w.description) : (w.detail || w.notes || "");
      return { ...w, step, name, description };
    }
    const str = typeof w === "string" ? w.trim() : (w != null ? String(w) : `Step ${i + 1}`);
    return {
      step: String(i + 1),
      name: str || `Step ${i + 1}`,
      description: "",
    };
  });
};

const BulletList = ({ items, mono = false }) => {
  const arr = normalizeList(items);
  if (arr.length === 0) return null;
  return (
    <View>
      {arr.map((item, i) => (
        <View key={i} style={s.bulletRow} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={[s.bulletText, mono ? { fontFamily: "Courier", fontSize: 7 } : {}]}>
            {typeof item === 'string' 
              ? cleanTextForPdf(item) 
              : (item?.improvement_name 
                  ? <Text><Text style={{ fontFamily: "Helvetica-Bold" }}>{cleanTextForPdf(item.improvement_name)}: </Text>{cleanTextForPdf(item.description)}</Text> 
                  : (item?.name && item?.description
                      ? <Text><Text style={{ fontFamily: "Helvetica-Bold" }}>{cleanTextForPdf(item.name)}: </Text>{cleanTextForPdf(item.description)}</Text>
                      : cleanTextForPdf(typeof item === 'object' ? (item?.name || item?.description || JSON.stringify(item)) : String(item))))}
          </Text>
        </View>
      ))}
    </View>
  );
};

const PDFTable = ({ headers, rows, colWidths }) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  return (
    <View style={s.table}>
      {/* Header Row with fixed prop to repeat across pages */}
      <View style={s.tableHeaderRow} fixed minPresenceAhead={50}>
        {headers.map((h, i) => (
          <Text key={`th-${i}`} style={[
            i < headers.length - 1 ? s.tableHeaderCell : s.tableHeaderCellLast,
            { width: colWidths[i], textAlign: h.align || "left" }
          ]}>{h.label}</Text>
        ))}
      </View>
      {/* Data Rows */}
      {safeRows.map((row, ri) => {
        const safeCells = Array.isArray(row) ? row : [row];
        return (
          <View key={`tr-${ri}`} style={[
            s.tableRow,
            ri === safeRows.length - 1 ? { borderBottomWidth: 0.5, borderColor: '#9ca3af' } : {}
          ]} wrap={false}>
            {safeCells.map((cell, ci) => (
              <View key={`td-${ci}`} style={[
                ci < safeCells.length - 1 ? s.tableCell : s.tableCellLast,
                { width: colWidths[ci] }
              ]}>
                {cell && typeof cell === 'object' && cell.$$typeof ? (
                  cell
                ) : typeof cell === "string" || typeof cell === "number" ? (
                  <Text>{cleanTextForPdf(String(cell))}</Text>
                ) : (
                  <Text>{cell != null ? cleanTextForPdf(typeof cell === "object" ? (cell.name || cell.value || cell.description || JSON.stringify(cell)) : String(cell)) : "—"}</Text>
                )}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DOCUMENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

const ExportTemplatePDF = ({ doc = {}, pageMap = {}, diagramImage }) => {
  const workflowSteps = normalizeWorkflow(doc?.technical?.workflow);
  const calculations = normalizeList(doc?.technical?.calculations);
  const errorHandling = normalizeList(doc?.technical?.error_handling);
  const generatedFiles = normalizeList(doc?.outputs?.generated_files);
  const notifications = normalizeList(doc?.outputs?.notifications);
  const reports = normalizeList(doc?.outputs?.reports);
  const credentials = normalizeList(doc?.security?.credentials);
  const sensitiveData = normalizeList(doc?.security?.sensitive_data);
  const securityConsiderations = normalizeList(doc?.security?.security_considerations);
  const knowledgeGaps = normalizeList(doc?.knowledge_gaps);
  const recommendations = normalizeList(doc?.recommendations);

  const sopSteps = normalizeList(doc?.business?.sop_steps).map((r, i) => {
    if (r && typeof r === 'object' && !Array.isArray(r)) {
      return {
        step: r.step != null ? String(r.step) : String(i + 1),
        name: r.name || r.step_name || r.title || (typeof r.description === 'string' ? r.description : `Step ${i + 1}`),
        implemented: r.implemented === true || r.implemented === "Yes" || r.implemented === "yes",
        notes: r.notes || r.description || "",
      };
    }
    const str = typeof r === 'string' ? r : String(r);
    return {
      step: String(i + 1),
      name: str || `Step ${i + 1}`,
      implemented: true,
      notes: "",
    };
  });
  const businessProcess = normalizeList(doc?.business?.business_process);
  const businessRules = normalizeList(doc?.business?.business_rules);
  const assumptions = normalizeList(doc?.business?.assumptions);
  const limitations = normalizeList(doc?.business?.limitations);

  const documents = normalizeList(doc?.inputs?.documents);
  const configFiles = normalizeList(doc?.inputs?.configuration_files);
  const envVars = normalizeList(doc?.inputs?.environment_variables);
  const languages = normalizeList(doc?.dependencies?.languages);
  const tools = normalizeList(doc?.dependencies?.tools);
  const externalSystems = normalizeList(doc?.dependencies?.external_systems);
  const apis = normalizeList(doc?.dependencies?.apis);
  const evidenceTesting = normalizeList(doc?.evidence_testing);

  const documentHistory = normalizeList(doc?.metadata?.document_history || doc?.meta?.history);

  const runtimeParams = normalizeList(doc?.inputs?.runtime_parameters);
  const hasRuntimeParams = runtimeParams.length > 0;
  const isRuntimeParamsTable = hasRuntimeParams && runtimeParams.some(f => {
    if (typeof f === 'object' && f !== null) return true;
    if (typeof f === 'string') {
      try { const p = JSON.parse(f); if (typeof p === 'object' && p !== null) return true; } catch (e) {}
    }
    return false;
  });

  const normalizedDoc = {
    ...doc,
    metadata: {
      ...doc?.metadata,
      document_history: documentHistory,
    },
    business: {
      ...doc?.business,
      sop_steps: sopSteps,
      business_process: businessProcess,
      business_rules: businessRules,
      assumptions,
      limitations,
    },
    inputs: {
      ...doc?.inputs,
      documents,
      configuration_files: configFiles,
      environment_variables: envVars,
      runtime_parameters: runtimeParams,
    },
    dependencies: {
      ...doc?.dependencies,
      languages,
      tools,
      external_systems: externalSystems,
      apis,
    },
    technical: {
      ...doc?.technical,
      workflow: workflowSteps,
      calculations,
      error_handling: errorHandling,
    },
    outputs: {
      ...doc?.outputs,
      generated_files: generatedFiles,
      notifications,
      reports,
    },
    security: {
      ...doc?.security,
      credentials,
      sensitive_data: sensitiveData,
      security_considerations: securityConsiderations,
    },
    knowledge_gaps: knowledgeGaps,
    recommendations,
  };
  const nums = getSectionNumbers(normalizedDoc);

  // Build TOC items
  const tocItems = [
    { title: "Information Confidentiality", id: "confidentiality", indent: 0, show: true },
    { title: "Disclaimer", id: "disclaimer", indent: 0, show: true },
    { title: "Contact", id: "contact", indent: 0, show: true },
    { title: "Contents", id: "toc", indent: 0, show: true },
    { title: "Document Approval", id: "approval", indent: 0, show: true },
    { title: "Document History", id: "history", indent: 0, show: documentHistory.length > 0 },
    
    { title: "1. BUSINESS CONTEXT", id: "ch1-title", indent: 0, isHeader: true, show: true },
    { title: `${nums.purpose} Purpose`, id: "ch1-purpose", indent: 1, show: !!doc?.business?.purpose },
    { title: `${nums.scope} Scope`, id: "ch1-scope", indent: 1, show: !!doc?.business?.scope },
    { title: `${nums.sop_mapping} SOP Steps`, id: "ch1-sop", indent: 1, show: sopSteps.length > 0 },
    { title: `${nums.process} Business Process`, id: "ch1-process", indent: 1, show: businessProcess.length > 0 },
    { title: `${nums.rules} Business Rules`, id: "ch1-rules", indent: 1, show: businessRules.length > 0 },
    { title: `${nums.assumptions} Assumptions`, id: "ch1-assumptions", indent: 1, show: assumptions.length > 0 },
    { title: `${nums.limitations} Limitations`, id: "ch1-limitations", indent: 1, show: limitations.length > 0 },
    
    { title: "2. INPUTS & DEPENDENCIES", id: "ch2-title", indent: 0, isHeader: true, show: true },
    { title: `${nums.documents} Documents`, id: "ch2-docs", indent: 1, show: documents.length > 0 },
    { title: `${nums.cfg} Configuration Files`, id: "ch2-cfg", indent: 1, show: configFiles.length > 0 },
    { title: `${nums.env} Environment Variables`, id: "ch2-env", indent: 1, show: envVars.length > 0 },
    { title: `${nums.params} Runtime Parameters`, id: "ch2-params", indent: 1, show: runtimeParams.length > 0 },
    { title: `${nums.lang} Languages`, id: "ch2-lang", indent: 1, show: languages.length > 0 },
    { title: `${nums.tools} Tools`, id: "ch2-tools", indent: 1, show: tools.length > 0 },
    { title: `${nums.ext} External Systems`, id: "ch2-ext", indent: 1, show: externalSystems.length > 0 },
    { title: `${nums.apis} APIs`, id: "ch2-apis", indent: 1, show: apis.length > 0 },

    { title: "3. TECHNICAL EXECUTION", id: "ch3-title", indent: 0, isHeader: true, show: true },
    { title: `${nums.exec_deploy} Execution & Deployment`, id: "ch3-exec-deploy", indent: 1, show: !!nums.exec_deploy },
    { title: `${nums.diagram} Workflow Diagram`, id: "ch3-diagram", indent: 1, show: !!nums.diagram },
    { title: `${nums.diagram_desc} Workflow Description`, id: "ch3-diagram-desc", indent: 1, show: !!nums.diagram_desc },
    { title: `${nums.diagram_auto} Workflow Diagram`, id: "ch3-auto-flowchart", indent: 1, show: !!nums.diagram_auto },
    { title: `${nums.workflow} Workflow Steps`, id: "ch3-workflow-table", indent: 1, show: !!nums.workflow },
    { title: `${nums.calc} Calculations`, id: "ch3-calc", indent: 1, show: calculations.length > 0 },
    { title: `${nums.error} Error Handling`, id: "ch3-error", indent: 1, show: errorHandling.length > 0 },

    { title: "4. OUTPUTS & SECURITY", id: "ch4-title", indent: 0, isHeader: true, show: true },
    { title: `${nums.gen_files} Generated Files`, id: "ch4-gen-files", indent: 1, show: generatedFiles.length > 0 },
    { title: `${nums.notify} Notifications`, id: "ch4-notify", indent: 1, show: notifications.length > 0 },
    { title: `${nums.reports} Reports`, id: "ch4-reports", indent: 1, show: reports.length > 0 },
    { title: `${nums.cred} Credentials`, id: "ch4-cred", indent: 1, show: credentials.length > 0 },
    { title: `${nums.sens} Sensitive Data`, id: "ch4-sens", indent: 1, show: sensitiveData.length > 0 },
    { title: `${nums.sec_con} Security Considerations`, id: "ch4-sec-con", indent: 1, show: securityConsiderations.length > 0 },
    { title: `${nums.gaps} Knowledge Gaps`, id: "ch4-gaps", indent: 1, show: knowledgeGaps.length > 0 },
    { title: `${nums.rec} Recommendations`, id: "ch4-rec", indent: 1, show: recommendations.length > 0 },

    { title: "5. EVIDENCE TESTING", id: "ch5-title", indent: 0, isHeader: true, show: evidenceTesting.length > 0 },
    ...evidenceTesting.map((ev, idx) => ({
      title: `5.${idx + 1}. ${ev.name || `Evidence #${idx + 1}`}`, id: `ch5-evidence-${idx}`, indent: 1, show: true
    })),
  ].filter(t => t.show);

  return (
    <Document
      title={`${doc.meta?.appName || "Document"} - Documentation of Automation`}
      author={doc.meta?.contact?.company || doc.meta?.companyName || "Example Technology Indonesia"}
      subject="Documentation of Automation"
    >

      {/* ══════════════ PAGE: COVER ══════════════ */}
      <Page size="A4" style={s.coverPage}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
          <Text style={[s.coverDocTitle, { textAlign: "center", fontSize: 10, letterSpacing: 1 }]}>
            {doc.meta?.docTitle || "DOCUMENTATION OF AUTOMATION"}
          </Text>
          <Text style={[s.coverClassification, { textAlign: "center", marginBottom: 30 }]}>
            {doc.meta?.classification || "Internal"}
          </Text>
          
          <Text style={[s.coverAppName, { textAlign: "center", fontSize: 24, borderBottomWidth: 0, paddingBottom: 0, marginBottom: 10 }]}>
            {doc.metadata?.app_name || doc.meta?.appName || "APPS"}
          </Text>
          <Text style={{ textAlign: "center", fontSize: 14, fontWeight: "bold", color: C.sky700, textTransform: "uppercase", marginBottom: 30 }}>
            {doc.metadata?.activity_name || doc.meta?.activityName || "ACTIVITY"}
          </Text>
          
          <View style={{ height: 2, width: 80, backgroundColor: C.sky700, marginBottom: 30 }} />

          <View style={{ alignItems: "center" }}>
            <Text style={[s.coverMetaLabel, { marginBottom: 6, fontSize: 9 }]}>Prepared for</Text>
            <Text style={[s.coverMetaValue, { fontSize: 11, textAlign: "center" }]}>{doc.meta?.preparedFor || "—"}</Text>
            
            <Text style={[{ fontWeight: "bold", letterSpacing: 2, marginTop: 24, fontSize: 9, color: C.gray700 }]}>
              {doc.meta?.confidentiality || "CONFIDENTIAL"}
            </Text>
          </View>
        </View>

        <View style={s.coverCompanyBlock}>
          {doc.meta?.logoImage ? (
            <Image src={doc.meta.logoImage} style={{ maxHeight: 65, maxWidth: 180, marginBottom: 12, objectFit: 'contain' }} />
          ) : (
            <View style={s.coverLogo}>
              <Text style={s.coverLogoText}>{doc.meta?.logoText || "LOGO"}</Text>
            </View>
          )}
          <Text style={s.coverCompanyName}>{doc.meta?.contact?.company || doc.meta?.companyName || "Example Technology Indonesia"}</Text>
          <Text style={s.coverCompanyAddr}>{doc.meta?.contact?.address || doc.meta?.companyAddress || ""}</Text>
          <Text style={[s.coverCompanyAddr, { marginTop: 6 }]}>
            {[
              doc.meta?.contact?.phone || doc.meta?.companyPhone ? `Phone: ${doc.meta?.contact?.phone || doc.meta?.companyPhone}` : null,
              doc.meta?.contact?.fax || doc.meta?.companyFax ? `Fax: ${doc.meta?.contact?.fax || doc.meta?.companyFax}` : null,
              doc.meta?.contact?.email ? `E-mail: ${doc.meta?.contact?.email}` : null,
              doc.meta?.contact?.website ? `Website: ${doc.meta?.contact?.website}` : null
            ].filter(Boolean).join(" | ")}
          </Text>
        </View>
      </Page>

      {/* ══════════════ PAGE: CONFIDENTIALITY + CONTACT ══════════════ */}
      <Page size="A4" style={s.page}>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />

        <Text style={s.sectionTitle}>
          <Text render={({ pageNumber }) => { if (pageMap) pageMap['confidentiality'] = pageNumber; return ""; }} />
          INFORMATION CONFIDENTIALITY
        </Text>
        <Text style={[s.bodyText, { marginBottom: 16 }]}>
          This document is confidential and proprietary information of {doc.meta?.contact?.company || doc.meta?.companyName || "Example Technology Indonesia"} and its partners. It should not be disclosed to any third party without express written authorization.
        </Text>

        <Text style={s.sectionTitle}>
          <Text render={({ pageNumber }) => { if (pageMap) pageMap['disclaimer'] = pageNumber; return ""; }} />
          DISCLAIMER
        </Text>
        <Text style={[s.bodyText, { marginBottom: 16 }]}>
          {doc.meta?.contact?.company || doc.meta?.companyName || "Example Technology Indonesia"} reserves the right to change any of the material described within this proposal at its discretion.
        </Text>

        <Text style={s.sectionTitle}>
          <Text render={({ pageNumber }) => { if (pageMap) pageMap['contact'] = pageNumber; return ""; }} />
          CONTACT
        </Text>
        <View style={s.contactCard}>
          <View style={s.contactCardHeader}>
            <Text style={{ color: C.white, fontWeight: "bold", fontSize: 9 }}>
              Company Information
            </Text>
          </View>
          <View style={s.contactCardBody}>
            <Text style={{ fontWeight: "bold", fontSize: 8, color: C.gray900, marginBottom: 4 }}>{doc.meta?.contact?.company || doc.meta?.companyName || "Example Technology Indonesia"}</Text>
            {doc.meta?.contact?.address ? <Text style={{ fontSize: 8, marginBottom: 2 }}>{doc.meta?.contact?.address}</Text> : false}
            <Text style={{ fontSize: 8, marginBottom: 2 }}>Phone: {doc.meta?.contact?.phone || ""}</Text>
            {doc.meta?.contact?.fax ? <Text style={{ fontSize: 8, marginBottom: 2 }}>Fax: {doc.meta?.contact?.fax}</Text> : false}
            {doc.meta?.contact?.email ? <Text style={{ fontSize: 8, marginBottom: 2 }}>E-mail: {doc.meta?.contact?.email}</Text> : false}
            {doc.meta?.contact?.website ? <Text style={{ fontSize: 8, marginBottom: 2 }}>Website: {doc.meta?.contact?.website}</Text> : false}
          </View>
        </View>
      </Page>

      {/* ══════════════ PAGE: TABLE OF CONTENTS ══════════════ */}
      <Page size="A4" style={s.page}>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <Text style={s.sectionTitle}>
          <Text render={({ pageNumber }) => { if (pageMap) pageMap['toc'] = pageNumber; return ""; }} />
          CONTENTS
        </Text>
        {tocItems.map((item, i) => (
          <View key={i} style={item.indent === 0 ? [s.tocRow, item.isHeader && { marginTop: 8 }] : s.tocRowIndented}>
            <Text style={item.indent === 0 ? s.tocTitle : s.tocSubTitle}>{item.title}</Text>
            {pageMap && pageMap[item.id] ? (
              <>
                <View style={{ flexGrow: 1, borderBottomWidth: 1, borderBottomColor: C.gray300, borderBottomStyle: 'dashed', marginHorizontal: 5, marginBottom: 3 }} />
                <Text style={item.indent === 0 ? s.tocTitle : s.tocSubTitle}>{pageMap[item.id]}</Text>
              </>
            ) : false}
          </View>
        ))}
      </Page>

      {/* ══════════════ PAGE: DOCUMENT APPROVAL ══════════════ */}
      <Page size="A4" style={s.page}>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <Text style={s.sectionTitle}>
          <Text render={({ pageNumber }) => { if (pageMap) pageMap['approval'] = pageNumber; return ""; }} />
          DOCUMENT APPROVAL
        </Text>

        {(() => {
          let groups = doc.meta?.signatureGroups;
          if (!groups || groups.length === 0) {
            return (
              <Text style={{ fontSize: 9, fontStyle: "italic", color: C.gray500, marginTop: 10 }}>No document approvals configured.</Text>
            );
          }
          return groups.map((group, gIdx) => {
            const sigs = group.signatories && group.signatories.length > 0 ? group.signatories : [];
            return (
              <View key={gIdx} style={{ marginBottom: 14 }}>
                <Text style={{ fontSize: 9, fontWeight: "bold", color: C.gray800, marginBottom: 6 }}>{group.title}</Text>
                {sigs.length > 0 ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderLeftWidth: 1, borderColor: C.gray400 }}>
                    {sigs.map((sig, idx) => (
                      <View key={idx} style={{ 
                        width: sigs.length === 1 ? "100%" : sigs.length === 3 ? "33.33%" : "50%",
                        padding: 14, 
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: C.gray400,
                        alignItems: "center"
                      }}>
                        <Text style={{ fontSize: 9, fontWeight: "bold", color: C.gray800, textAlign: "center", lineHeight: 1.3 }}>{sig.name || "—"}</Text>
                        <Text style={{ fontSize: 8, color: C.gray600, marginTop: 2, textAlign: "center" }}>({sig.role || "—"})</Text>
                        <Text style={{ fontSize: 8, color: C.gray400, fontStyle: "italic", marginTop: 40 }}>(Signature & Date)</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={{ fontSize: 9, color: C.gray500, fontStyle: "italic" }}>No signatories</Text>
                )}
              </View>
            );
          });
        })()}
      </Page>

      {/* ══════════════ PAGE: DOCUMENT HISTORY ══════════════ */}
      {documentHistory.length > 0 && (
        <Page size="A4" style={s.page}>
          <PDFHeader doc={doc} />
          <PDFFooter doc={doc} />
          <Text style={s.sectionTitle} minPresenceAhead={250}>
            <Text render={({ pageNumber }) => { if (pageMap) pageMap['history'] = pageNumber; return ""; }} />
            DOCUMENT HISTORY
          </Text>
          <PDFTable
            headers={[
              { label: "Version", align: "center" },
              { label: "Date" },
              { label: "Author" },
              { label: "Description" },
            ]}
            colWidths={["15%", "20%", "25%", "40%"]}
            rows={documentHistory.map(h => [
              h.version,
              h.date,
              h.author,
              h.change_reference || h.description || "",
            ])}
          />
        </Page>
      )}

      {/* ══════════════ CONTENT PAGES ══════════════ */}
      
      {/* ── CHAPTER 1: BUSINESS CONTEXT ── */}
      <Page size="A4" style={s.page} wrap>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <ChapterTitle id="ch1-title" pageMapObj={pageMap}>1. BUSINESS CONTEXT</ChapterTitle>

        {doc.business?.purpose && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-purpose" pageMapObj={pageMap}>{nums?.purpose || "1.1."} PURPOSE</SubmenuTitle>
            <Text style={s.bodyText}>{doc.business.purpose}</Text>
          </View>
        )}

        {doc.business?.scope && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-scope" pageMapObj={pageMap}>{nums?.scope || "1.2."} SCOPE</SubmenuTitle>
            <Text style={s.bodyText}>{doc.business.scope}</Text>
          </View>
        )}

        {sopSteps.length > 0 && (
          <View style={s.sectionWrap}>
             <SubmenuTitle id="ch1-sop" pageMapObj={pageMap} minPresenceAhead={250}>{nums?.sop_mapping || "1.3."} SOP STEPS</SubmenuTitle>
             <PDFTable
               headers={[{ label: "Step" }, { label: "Name" }, { label: "Implemented" }, { label: "Notes" }]}
               colWidths={["15%", "30%", "20%", "35%"]}
               rows={sopSteps.map((r, i) => [
                 r.step || String(i+1),
                 r.name,
                 r.implemented ? "Yes" : "No",
                 r.notes || ""
               ])}
             />
          </View>
        )}

        {businessProcess.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-process" pageMapObj={pageMap}>{nums?.process || "1.4."} BUSINESS PROCESS</SubmenuTitle>
            <BulletList items={businessProcess} />
          </View>
        )}

        {businessRules.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-rules" pageMapObj={pageMap}>{nums?.rules || "1.5."} BUSINESS RULES</SubmenuTitle>
            <BulletList items={businessRules} />
          </View>
        )}

        {assumptions.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-assumptions" pageMapObj={pageMap}>{nums?.assumptions || "1.6."} ASSUMPTIONS</SubmenuTitle>
            <BulletList items={assumptions} />
          </View>
        )}

        {limitations.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch1-limitations" pageMapObj={pageMap}>{nums?.limitations || "1.7."} LIMITATIONS</SubmenuTitle>
            <BulletList items={limitations} />
          </View>
        )}
      </Page>

      {/* ── CHAPTER 2: INPUTS & DEPENDENCIES ── */}
      <Page size="A4" style={s.page} wrap>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <ChapterTitle id="ch2-title" pageMapObj={pageMap}>2. INPUTS & DEPENDENCIES</ChapterTitle>

        {documents.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-docs" pageMapObj={pageMap}>{nums?.documents || "2.1."} DOCUMENTS</SubmenuTitle>
            <BulletList items={documents} />
          </View>
        )}

        {configFiles.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-cfg" pageMapObj={pageMap}>{nums?.cfg || "2.2."} CONFIGURATION FILES</SubmenuTitle>
            <BulletList items={configFiles} />
          </View>
        )}

        {envVars.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-env" pageMapObj={pageMap}>{nums?.env || "2.3."} ENVIRONMENT VARIABLES</SubmenuTitle>
            <BulletList items={envVars} />
          </View>
        )}

        {hasRuntimeParams && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-params" pageMapObj={pageMap} minPresenceAhead={isRuntimeParamsTable ? 250 : 100}>{nums?.params || "2.4."} RUNTIME PARAMETERS</SubmenuTitle>
            {isRuntimeParamsTable ? (
              <PDFTable 
                headers={[
                  { label: "Parameter Name" },
                  { label: "Description" }
                ]}
                colWidths={["35%", "65%"]}
                rows={runtimeParams.map(f => {
                  let obj = f;
                  if (typeof f === 'string') {
                    try { const p = JSON.parse(f); if (typeof p === 'object' && p !== null) obj = p; } catch (e) { obj = { name: f, description: "" }; }
                  }
                  return [obj?.name || (typeof obj === 'object' ? JSON.stringify(obj) : String(obj)), obj?.description || ""];
                })}
              />
            ) : (
              <BulletList items={runtimeParams} />
            )}
          </View>
        )}

        {languages.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-lang" pageMapObj={pageMap}>{nums?.lang || "2.5."} LANGUAGES</SubmenuTitle>
            <BulletList items={languages} />
          </View>
        )}

        {tools.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-tools" pageMapObj={pageMap}>{nums?.tools || "2.6."} TOOLS</SubmenuTitle>
            <BulletList items={tools} />
          </View>
        )}

        {externalSystems.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-ext" pageMapObj={pageMap}>{nums?.ext || "2.7."} EXTERNAL SYSTEMS</SubmenuTitle>
            <BulletList items={externalSystems} />
          </View>
        )}

        {apis.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch2-apis" pageMapObj={pageMap}>{nums?.apis || "2.8."} APIS</SubmenuTitle>
            <BulletList items={apis} />
          </View>
        )}
      </Page>

      {/* ── CHAPTER 3: TECHNICAL EXECUTION ── */}
      <Page size="A4" style={s.page} wrap>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <ChapterTitle id="ch3-title" pageMapObj={pageMap}>3. TECHNICAL EXECUTION</ChapterTitle>

        {(doc.execution || doc.deployment) && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch3-exec-deploy" pageMapObj={pageMap} minPresenceAhead={250}>{nums?.exec_deploy || "3.1."} EXECUTION & DEPLOYMENT</SubmenuTitle>
            <PDFTable
              headers={[{ label: "Parameter" }, { label: "Value" }]}
              colWidths={["30%", "70%"]}
              rows={[
                ...(doc.execution?.command ? [["Command", <Text style={{fontFamily: "Courier"}}>{doc.execution.command}</Text>]] : []),
                ...(doc.execution?.scheduler ? [["Scheduler", doc.execution.scheduler]] : []),
                ...(doc.deployment?.server_path ? [["Server Path", doc.deployment.server_path]] : []),
                ...(doc.deployment?.server_name ? [["Server Name", doc.deployment.server_name]] : []),
                ...(doc.deployment?.user ? [["User", doc.deployment.user]] : []),
              ]}
            />
          </View>
        )}

        {(() => {
          const manualDiagram = doc.technical?.workflow_diagram?.trim();
          const isMermaid = manualDiagram && (
            /^(graph|flowchart|sequenceDiagram|stateDiagram|classDiagram|pie|gantt)/i.test(manualDiagram) ||
            manualDiagram.startsWith('%%')
          );
          const isInlineFlow = manualDiagram && !isMermaid && manualDiagram.split(/(?:->|-->|\u2192)/).length > 1;

          const renderDiagramBlock = () => (
            <View style={s.sectionWrap}>
              <SubmenuTitle id="ch3-diagram" pageMapObj={pageMap}>{nums?.diagram || "3.1."} WORKFLOW DIAGRAM</SubmenuTitle>
              {diagramImage ? (
                <View style={{ marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4, padding: 10, backgroundColor: "#f9fafb" }}>
                  <Image src={diagramImage} style={{ width: "100%", maxHeight: 500, objectFit: "contain" }} />
                </View>
              ) : (
                <Text style={{ fontSize: 9, fontStyle: "italic", color: C.gray500, marginTop: 10 }}>Workflow diagram available in web preview only</Text>
              )}
            </View>
          );
          
          const renderAutoDiagramBlock = (stepsToRender, titleNum, idStr = "ch3-auto-flowchart") => (
            <View style={s.sectionWrap}>
              <SubmenuTitle id={idStr} pageMapObj={pageMap}>{titleNum || "3.1."} WORKFLOW DIAGRAM</SubmenuTitle>
              <View style={{ marginTop: 10, padding: 10, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 4, backgroundColor: "#ffffff" }}>
                <CustomWorkflowDiagramPDF steps={stepsToRender} />
              </View>
            </View>
          );

          return (
            <>
              {manualDiagram && !isMermaid && !isInlineFlow ? (
                <View style={s.sectionWrap}>
                  <SubmenuTitle id="ch3-diagram-desc" pageMapObj={pageMap}>{nums?.diagram_desc || "3.1."} WORKFLOW DESCRIPTION</SubmenuTitle>
                  <Text style={s.bodyText}>{manualDiagram}</Text>
                </View>
              ) : false}
              
              {isMermaid ? renderDiagramBlock() : false}
              
              {isInlineFlow ? renderAutoDiagramBlock(
                manualDiagram.split(/(?:->|-->|\u2192)/).map((p, i) => ({ step: i+1, name: p.trim() })).filter(s => s.name),
                nums?.diagram,
                "ch3-diagram"
              ) : false}

              {!isMermaid && !isInlineFlow && workflowSteps.length > 0 ? renderAutoDiagramBlock(
                workflowSteps,
                nums?.diagram_auto
              ) : false}
            </>
          );
        })()}

        {workflowSteps.length > 0 && (
          <View style={s.sectionWrap}>
             <SubmenuTitle id="ch3-workflow-table" pageMapObj={pageMap} minPresenceAhead={250}>{nums?.workflow || "3.2."} WORKFLOW STEPS</SubmenuTitle>
             <PDFTable
               headers={[{ label: "Step", align: "center" }, { label: "Name" }, { label: "Description" }]}
               colWidths={["15%", "30%", "55%"]}
               rows={workflowSteps.map((w, i) => [
                 w.step || String(i+1), w.name, w.description || ""
               ])}
             />
          </View>
        )}

        {calculations.length > 0 && (
          <View style={s.sectionWrap}>
             <SubmenuTitle id="ch3-calc" pageMapObj={pageMap}>{nums?.calc || "3.3."} CALCULATIONS</SubmenuTitle>
             <BulletList items={calculations} />
          </View>
        )}

        {errorHandling.length > 0 && (
          <View style={s.sectionWrap}>
             <SubmenuTitle id="ch3-error" pageMapObj={pageMap}>{nums?.error || "3.4."} ERROR HANDLING</SubmenuTitle>
             <BulletList items={errorHandling} />
          </View>
        )}
      </Page>

      {/* ── CHAPTER 4: OUTPUTS & SECURITY ── */}
      <Page size="A4" style={s.page} wrap>
        <PDFHeader doc={doc} />
        <PDFFooter doc={doc} />
        <ChapterTitle id="ch4-title" pageMapObj={pageMap}>4. OUTPUTS & SECURITY</ChapterTitle>

        {generatedFiles.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-gen-files" pageMapObj={pageMap}>{nums?.gen_files || "4.1."} GENERATED FILES</SubmenuTitle>
            <BulletList items={generatedFiles} />
          </View>
        )}

        {notifications.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-notify" pageMapObj={pageMap}>{nums?.notify || "4.2."} NOTIFICATIONS</SubmenuTitle>
            <BulletList items={notifications} />
          </View>
        )}

        {reports.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-reports" pageMapObj={pageMap}>{nums?.reports || "4.3."} REPORTS</SubmenuTitle>
            <BulletList items={reports} />
          </View>
        )}

        {credentials.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-cred" pageMapObj={pageMap}>{nums?.cred || "4.4."} CREDENTIALS</SubmenuTitle>
            <BulletList items={credentials} />
          </View>
        )}

        {sensitiveData.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-sens" pageMapObj={pageMap}>{nums?.sens || "4.5."} SENSITIVE DATA</SubmenuTitle>
            <BulletList items={sensitiveData} />
          </View>
        )}

        {securityConsiderations.length > 0 && (
          <View style={s.sectionWrap}>
            <SubmenuTitle id="ch4-sec-con" pageMapObj={pageMap}>{nums?.sec_con || "4.6."} SECURITY CONSIDERATIONS</SubmenuTitle>
            <BulletList items={securityConsiderations} />
          </View>
        )}

        {knowledgeGaps.length > 0 && (
           <View style={s.sectionWrap}>
             <SubmenuTitle id="ch4-gaps" pageMapObj={pageMap}>{nums?.gaps || "4.7."} KNOWLEDGE GAPS</SubmenuTitle>
             <BulletList items={knowledgeGaps} />
           </View>
        )}

        {recommendations.length > 0 && (
           <View style={s.sectionWrap}>
             <SubmenuTitle id="ch4-rec" pageMapObj={pageMap}>{nums?.rec || "4.8."} RECOMMENDATIONS</SubmenuTitle>
             <BulletList items={recommendations} />
           </View>
        )}
      </Page>

      {/* ── CHAPTER 5: EVIDENCE TESTING ── */}
      {evidenceTesting.length > 0 && (
        <Page size="A4" style={s.page} wrap>
          <PDFHeader doc={doc} />
          <PDFFooter doc={doc} />
          <ChapterTitle id="ch5-title" pageMapObj={pageMap}>5. EVIDENCE TESTING</ChapterTitle>

          {evidenceTesting.map((ev, idx) => (
            <View key={idx} style={s.sectionWrap} wrap={false}>
              <SubmenuTitle id={`ch5-evidence-${idx}`} pageMapObj={pageMap}>5.{idx + 1}. {(ev?.name || `EVIDENCE #${idx + 1}`).toUpperCase()}</SubmenuTitle>
              {ev?.image ? (
                <View style={{ marginTop: 10, alignItems: "center", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 4, padding: 10, backgroundColor: "#f9fafb" }}>
                  <Image src={ev.image} style={{ width: "100%", maxHeight: 500, objectFit: "contain" }} />
                </View>
              ) : false}
              {ev?.info ? (
                <Text style={[s.bodyText, { marginTop: 8 }]}>{ev.info}</Text>
              ) : false}
            </View>
          ))}
        </Page>
      )}

    </Document>
  );
};

export default ExportTemplatePDF;
