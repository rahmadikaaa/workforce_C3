# Bulk Premium Monitoring

## Overview

Bulk Premium Monitoring is an automation used to monitor Bulk Premium transaction metrics and publish monitoring results to Microsoft Teams.

---

## Business Purpose

Ensure transaction health can be monitored continuously.

---

## Scope

Monitor transaction volume, success rate, response time, and business errors.

---

## Technical Workflow

1. Load configuration.
2. Execute Splunk query.
3. Normalize transaction data.
4. Calculate monitoring metrics.
5. Generate HTML summary.
6. Send notification to Microsoft Teams.

---

## Dependencies

### External Systems

- Splunk
- Microsoft Teams

### APIs

- Splunk REST API
- Microsoft Teams API

### Tools

- Bash
- curl
- awk

---

## Known Limitations

- Dynatrace integration is unavailable.
- DLR monitoring is unavailable.

---

## Recommendations

- Implement Dynatrace integration.
- Implement DLR monitoring.