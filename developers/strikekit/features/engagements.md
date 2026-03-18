---
title: "Engagements"
description: "Engagements are the top-level container for all red team operations in StrikeKit. Each engagement represents a distinct project with its own scope, ti"
nav_order: 6
parent: "StrikeKit"
---

## Creating an Engagement

![Engagements List](../images/Engagements.png)
*Engagement management showing all projects*

1. Navigate to **Headquarters → Engagements**
2. Click **Create Engagement**
3. Fill in the required fields:

### Required Fields

- **Name**: Short identifier for the engagement (e.g., "ACME Corp Q1 2026")
- **Client**: Client organization name
- **Type**: Engagement methodology
  - Internal Network Pentest
  - External Pentest
  - Web Application Testing
  - Social Engineering
  - Physical Security Assessment
- **Start Date**: When the engagement begins
- **End Date**: When the engagement ends

### Important Fields

- **Scope**: Define what's in scope
  - IP address ranges (e.g., `10.0.0.0/8`)
  - Domain names (e.g., `*.example.com`)
  - Specific systems or applications
  - Geographic locations (for physical assessments)

- **Rules of Engagement (ROE)**: Constraints and guidelines
  - Hours of operation (e.g., "9am-5pm Monday-Friday")
  - Prohibited actions (e.g., "No DoS attacks")
  - Notification requirements (e.g., "Notify before privilege escalation")
  - Data handling restrictions
  - Emergency contacts

## Engagement Status Workflow

Engagements progress through distinct phases:

1. **Planning**: Initial setup and preparation
2. **Active**: Operations in progress
3. **Paused**: Temporarily suspended (client request, holidays)
4. **Complete**: Operations finished, report pending
5. **Archived**: Final report delivered, engagement closed

To change engagement status, edit the engagement and select a new status from the dropdown.

## Selecting an Active Engagement

Use the **engagement selector** at the top of the sidebar to switch between engagements:

1. Click the dropdown labeled "Active Engagement"
2. Select an engagement from the list
3. Engagement-specific views become available

When no engagement is selected, views requiring an active engagement are disabled.

## Engagement Details

Click on an engagement to view:

- **Overview**: Status, dates, client info
- **Scope**: What's in scope and out of scope
- **ROE**: Rules and constraints
- **Statistics**:
  - Target count
  - Findings by severity
  - Credentials discovered
  - Evidence collected
  - Activities performed

## Best Practices

### Scope Definition

Be specific and comprehensive:

```
Good:
- IP ranges: 192.168.1.0/24, 10.0.0.0/16
- Domains: *.example.com, api.example.com
- Exclusions: 192.168.1.100 (production DB)

Avoid:
- "Client network"
- "Everything"
```

### Rules of Engagement

Document clearly to avoid misunderstandings:

```
Good:
- Testing hours: Monday-Friday 9am-5pm EST
- Notify client before: privilege escalation, data exfiltration
- Prohibited: DoS attacks, physical access without escort
- Emergency contact: security@example.com, +1-555-0100

Avoid:
- "Standard ROE"
- "Ask client first"
```

### Engagement Naming

Use consistent naming conventions:

```
Examples:
- "ACME Corp - External Pentest - Q1 2026"
- "MegaCorp - Internal Assessment - Jan 2026"
- "StartupXYZ - Web App Test - Sprint 5"
```

## Engagement Templates

Speed up engagement creation with templates:

1. Create an engagement manually with common settings
2. Navigate to **Headquarters → Templates**
3. Create a template based on the engagement
4. Templates can include:
   - Pre-defined objectives
   - Common checklists
   - Standard target categories
   - Report templates

## Multiple Engagements

StrikeKit supports running multiple engagements simultaneously:

- Each engagement has isolated data (targets, findings, credentials)
- Switch between engagements using the selector
- Dashboard shows metrics for the active engagement only
- Timeline and Kill Chain are engagement-specific

## Archiving Engagements

When an engagement is complete and the final report is delivered:

1. Change status to **Archived**
2. Archived engagements:
   - No longer appear in the active list by default
   - Data is retained in the database
   - Can be restored if needed
   - Useful for historical reference

## Common Workflows

### Starting a New Engagement

1. Create engagement with scope and ROE
2. Set status to **Planning**
3. Define objectives (**Mission → Objectives**)
4. Review methodology checklists
5. Change status to **Active** when ready to begin operations

### Pausing an Engagement

If operations need to stop temporarily:

1. Change status to **Paused**
2. Add notes explaining why (client request, holiday, scope change)
3. Document where you left off in **Reporting → Notes**
4. Resume by changing status back to **Active**

### Completing an Engagement

When operations are finished:

1. Change status to **Complete**
2. Finalize all findings
3. Generate reports
4. Deliver to client
5. Change status to **Archived** after final delivery

## Tips

1. **Set realistic dates**: Account for holidays, client availability, and potential extensions
2. **Update ROE as needed**: If scope changes, update the engagement immediately
3. **Use descriptive names**: Make it easy to identify engagements months later
4. **Document exceptions**: If something unusual happens, note it in the engagement description
5. **Review statistics regularly**: Use the overview to track progress toward objectives

## Related Features

- [Objectives](objectives) - Define engagement goals
- [Planning](planning) - AI-assisted engagement planning
- [Dashboard](../user-guide/interface-overview#dashboard) - Engagement metrics
- [Reports](reports) - Generate deliverables

---

## Next Steps

After creating your engagement:

1. **[Set Objectives](objectives)** - Define what you want to achieve
2. **[Use Planning Assistant](planning)** - Get AI-guided planning help
3. **[Review Checklists](checklists)** - Understand methodology steps
4. **[Add Targets](targets)** - Begin identifying systems to test
5. **[Start Execution](execution)** - Begin active operations

**Related Documentation:**
- [Workflow Guide](../user-guide/workflow) - Complete engagement workflow
- [Dashboard](../user-guide/interface-overview#dashboard) - Track engagement metrics
- [Reports](reports) - Generate deliverables at engagement end

## Video Tutorial

> 📹 **Coming Soon**: Complete walkthrough of creating and managing engagements

## Quick Demo

> 🎬 **Coming Soon**: 30-second GIF showing engagement creation

