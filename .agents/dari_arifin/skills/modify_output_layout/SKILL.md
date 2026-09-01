---
name: Modify Output Layout (PDF & Web Preview)
description: Guidelines and architecture details for modifying the Web Preview and PDF Export templates in Flow Doc Generator.
---

# Modify Output Layout (PDF & Web Preview)

When the user asks to modify the PDF output, preview output, layout, or table of contents, follow the architectural guidelines in this skill. This ensures both Web Preview and PDF Export stay synchronized.

## Core Architecture

The output rendering system consists of four main layers:

1. **Numbering Utility (`src/utils/numbering.js`)**
   Generates dynamic chapter numbering based on the presence of data.
   - If you add or remove a section in the schema, update this file to ensure the section receives an auto-incrementing chapter number.

2. **Table of Contents (`src/components/TocList.jsx`)**
   Generates the *Table of Contents* for the Web Preview.
   - Contains an array `baseTocItems` which defines the exact order and indentation of chapters.
   - Tied to `numbering.js` for chapter titles.

3. **Web Preview (`src/components/PreviewPanel.jsx`)**
   Generates the live HTML/DOM preview shown on the right side of the UI.
   - Uses a custom closure-based `add(id, isStandalonePage, startsNewPage, renderFn)` function inside a `useMemo`.
   - Each section (e.g., `ch1-purpose`, `ch2-env`) is pushed via `add()` sequentially.
   - **Important**: Web DOM elements (`div`, `section`, `p`, `ul`, `table`) and utility classes like Tailwind CSS are used here.

4. **PDF Export (`src/components/ExportTemplatePDF.jsx`)**
   Generates the native, downloadable PDF document using **React-PDF** (`@react-pdf/renderer`).
   - Does NOT use HTML or Tailwind CSS. Uses strict React-PDF primitives: `<Document>`, `<Page>`, `<View>`, `<Text>`, `<Image>`.
   - Styles are declared via a `StyleSheet.create({...})` block at the top.
   - Contains a mirrored `tocItems` array for rendering the Table of Contents native to the PDF.
   - Pages are grouped manually using `<Page wrap>` boundaries.

## Rules for Modification

1. **Always Synchronize Preview and PDF**: 
   If the user asks to "tambahkan section X di PDF", you MUST add it to BOTH `PreviewPanel.jsx` and `ExportTemplatePDF.jsx`, unless explicitly told to ignore one.
   
2. **React-PDF Syntax Limitations (`ExportTemplatePDF.jsx`)**:
   - You CANNOT use HTML tags (`<div>`, `<span>`, `<p>`, `<br>`).
   - You CANNOT use tailwind classes (`className="mb-4"`).
   - Use `<View style={s.sectionWrap}>` for container blocks.
   - Use `<Text style={s.bodyText}>` for paragraphs.
   - Use the custom `<BulletList items={array} />` and `<PDFTable headers={[]} rows={[[]]} />` components for lists and tables.

3. **Updating the Table of Contents**:
   If a new section is added to the output layout:
   - Add it to `src/utils/numbering.js`
   - Add it to `baseTocItems` in `src/components/TocList.jsx`
   - Add it to `tocItems` in `src/components/ExportTemplatePDF.jsx`

## Example Task Flow
If instructed to: *"Tambahkan bagian SLA (Service Level Agreement) pada Business Context PDF dan Preview"*
- **Step 1**: Update `src/utils/numbering.js` to assign a number to SLA.
- **Step 2**: Add the item to `TocList.jsx` and `ExportTemplatePDF.jsx` TOC arrays.
- **Step 3**: Inject the DOM `section` in `PreviewPanel.jsx` right after the other Business Context fields.
- **Step 4**: Inject the `<View>` block in `ExportTemplatePDF.jsx` inside the Chapter 1 `<Page>` wrapper.
