---
name: Generate FSD JSON
description: Generates a Functional Specification Document JSON based on the v3.0.0 schema for the Flow Doc Generator project.
---

# Generate FSD JSON

When the user asks you to generate a new document, documentation, JSON template, or FSD JSON for an automation flow, use this skill to ensure the output strictly follows the required schema for the `Flow Doc Generator` application.

## Schema Requirements

The application uses a strict JSON schema (v3.0.0). Your generated JSON must follow this exact structure. Do NOT use old chapters like `system_architecture` or `execution_logic`.

### Root Structure

```json
{
    "metadata": {
        "app_name": "String (Name of the application)",
        "activity_name": "String (Name of the automation flow)",
        "version": "String (e.g. 1.0.0)",
        "language": "String (e.g. Python, Bash, Node.js)",
        "entrypoint": "String (e.g. main.py, script.sh)",
        "analysis_timestamp": "String (ISO 8601)",
        "document_history": [
            {
                "version": "1.0.0",
                "author": "String",
                "date": "YYYY-MM-DD",
                "change_reference": "Initial documentation"
            }
        ]
    },
    "business": {
        "purpose": "String",
        "scope": "String",
        "sop_steps": [
            {
                "step": "1",
                "name": "String",
                "implemented": true,
                "notes": "String"
            }
        ],
        "business_process": ["String", "String"],
        "business_rules": ["String", "String"],
        "assumptions": ["String", "String"],
        "limitations": ["String", "String"]
    },
    "inputs": {
        "documents": ["String"],
        "configuration_files": ["String"],
        "environment_variables": ["String"],
        "runtime_parameters": ["String"]
    },
    "dependencies": {
        "languages": ["String"],
        "tools": ["String"],
        "external_systems": ["String"],
        "apis": ["String"]
    },
    "technical": {
        "workflow_diagram": "String (Mermaid.js flowchart code)",
        "workflow": [
            {
                "step": 1,
                "name": "String",
                "description": "String",
                "inputs": ["String"],
                "outputs": ["String"]
            }
        ],
        "calculations": ["String"],
        "error_handling": ["String"]
    },
    "outputs": {
        "generated_files": ["String"],
        "notifications": ["String"],
        "reports": ["String"]
    },
    "security": {
        "credentials": ["String"],
        "sensitive_data": ["String"],
        "security_considerations": ["String"]
    },
    "knowledge_gaps": ["String"],
    "recommendations": ["String"]
}
```

## Instructions for Agent
1. **Analyze User Request**: Understand the domain, application name, activity name, and technical details of the flow the user wants to document.
2. **Context & Domain**: Use terms appropriate to the domain (e.g., C2P, SLCS, AO, Splunk) if applicable, based on the `domain-context.md` rule.
3. **Mermaid Diagram**: Ensure `technical.workflow_diagram` is a valid Mermaid.js string. Avoid syntax errors in Mermaid logic.
4. **Data Population**:
   - If information for a field is not provided, use an empty array `[]` (if the field is an array) or an empty string `""` (if it's a string), rather than omitting the key. The schema requires these keys to be present.
   - For `business_process`, `business_rules`, etc., formulate them as clear bullet points (strings in an array).
5. **Output Delivery**: Return the generated JSON enclosed in a standard markdown `json` block so the user can easily copy it and paste it into the application.
