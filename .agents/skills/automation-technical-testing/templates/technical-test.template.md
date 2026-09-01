# Technical Test Specification

## Automation Information

| Field | Value |
|--------|--------|
| Automation | {{automation_name}} |
| Version | {{version}} |
| Language | {{language}} |

---

# 1. Black Box Testing

Mengevaluasi behavior automation dari perspektif input, execution, dan output tanpa bergantung pada detail implementasi internal.

## 1.1 Functional & Execution Test Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{black_box_functional_tests}}

## 1.2 Input & Parameter Validation

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{black_box_input_tests}}

## 1.3 Output & Delivery Validation

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{black_box_output_tests}}

## 1.4 Boundary & Edge Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{black_box_boundary_tests}}

## 1.5 Negative & Failure Cases

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{black_box_negative_tests}}

---

# 2. White Box Testing

Mengevaluasi logika internal, control flow, fungsi/komponen internal, parsing data, dan penanganan error berdasarkan implementasi yang tersedia.

## 2.1 Internal Logic & Control Flow

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{white_box_logic_tests}}

## 2.2 Component & Parsing Mechanics

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{white_box_parsing_tests}}

## 2.3 Internal Error Handling & Exit Behavior

| Test ID | Test Type | Scenario / Component | Test Steps | Expected Result | Actual Result | Status |
|---------|-----------|----------------------|------------|-----------------|---------------|--------|
{{white_box_error_tests}}