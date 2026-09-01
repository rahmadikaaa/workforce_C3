export function getSectionNumbers(doc) {
  const nums = {};
  let ch1 = 1, ch2 = 1, ch3 = 1, ch4 = 1;

  // Chapter 1: Business Context
  if (doc?.business?.purpose) nums.purpose = `1.${ch1++}.`;
  if (doc?.business?.scope) nums.scope = `1.${ch1++}.`;
  if (doc?.business?.sop_steps?.length > 0) nums.sop_mapping = `1.${ch1++}.`;
  if (doc?.business?.business_process?.length > 0) nums.process = `1.${ch1++}.`;
  if (doc?.business?.business_rules?.length > 0) nums.rules = `1.${ch1++}.`;
  if (doc?.business?.assumptions?.length > 0) nums.assumptions = `1.${ch1++}.`;
  if (doc?.business?.limitations?.length > 0) nums.limitations = `1.${ch1++}.`;

  // Chapter 2: Inputs & Dependencies
  if (doc?.inputs?.documents?.length > 0) nums.documents = `2.${ch2++}.`;
  if (doc?.inputs?.configuration_files?.length > 0) nums.cfg = `2.${ch2++}.`;
  if (doc?.inputs?.environment_variables?.length > 0) nums.env = `2.${ch2++}.`;
  if (doc?.inputs?.runtime_parameters?.length > 0) nums.params = `2.${ch2++}.`;
  if (doc?.dependencies?.languages?.length > 0) nums.lang = `2.${ch2++}.`;
  if (doc?.dependencies?.tools?.length > 0) nums.tools = `2.${ch2++}.`;
  if (doc?.dependencies?.external_systems?.length > 0) nums.ext = `2.${ch2++}.`;
  if (doc?.dependencies?.apis?.length > 0) nums.apis = `2.${ch2++}.`;

  // Chapter 3: Technical Execution
  if (doc?.execution || doc?.deployment) nums.exec_deploy = `3.${ch3++}.`;

  const manualDiagram = doc?.technical?.workflow_diagram?.trim();
  const isMermaid = manualDiagram && (
    /^(graph|flowchart|sequenceDiagram|stateDiagram|classDiagram|pie|gantt)/i.test(manualDiagram) ||
    manualDiagram.split(/(?:->|-->|\u2192)/).length > 1
  );

  if (manualDiagram) {
    if (isMermaid) {
      nums.diagram = `3.${ch3++}.`;
    } else {
      nums.diagram_desc = `3.${ch3++}.`;
      if (doc?.technical?.workflow?.length > 0) nums.diagram_auto = `3.${ch3++}.`;
    }
  } else if (doc?.technical?.workflow?.length > 0) {
     nums.diagram_auto = `3.${ch3++}.`;
  }

  if (doc?.technical?.workflow?.length > 0) nums.workflow = `3.${ch3++}.`;
  if (doc?.technical?.calculations?.length > 0) nums.calc = `3.${ch3++}.`;
  if (doc?.technical?.error_handling?.length > 0) nums.error = `3.${ch3++}.`;

  // Chapter 4: Outputs & Security
  if (doc?.outputs?.generated_files?.length > 0) nums.gen_files = `4.${ch4++}.`;
  if (doc?.outputs?.notifications?.length > 0) nums.notify = `4.${ch4++}.`;
  if (doc?.outputs?.reports?.length > 0) nums.reports = `4.${ch4++}.`;
  if (doc?.security?.credentials?.length > 0) nums.cred = `4.${ch4++}.`;
  if (doc?.security?.sensitive_data?.length > 0) nums.sens = `4.${ch4++}.`;
  if (doc?.security?.security_considerations?.length > 0) nums.sec_con = `4.${ch4++}.`;
  if (doc?.knowledge_gaps?.length > 0) nums.gaps = `4.${ch4++}.`;
  if (doc?.recommendations?.length > 0) nums.rec = `4.${ch4++}.`;

  return nums;
}
