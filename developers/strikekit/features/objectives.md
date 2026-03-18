---
title: "Objectives"
description: "Objectives define the goals and success criteria for red team engagements, ensuring operations stay focused and aligned with client expectations."
nav_order: 9
parent: "StrikeKit"
---

## Creating Objectives

![Objectives View](../images/Objectives.png)
*Objective tracking with progress and status*

1. Navigate to **Mission → Objectives**
2. Click **Create Objective**
3. Define objective details

## Objective Components

### Title
Clear, measurable goal:
```
Good:
- "Gain Domain Admin privileges"
- "Access customer database"
- "Exfiltrate sensitive data from file server"
- "Establish persistence on critical systems"

Avoid:
- "Break in"
- "Get access"
- "Test security"
```

### Description
Detailed explanation of what needs to be achieved:
```markdown
## Goal
Demonstrate ability to access production database containing customer PII

## Success Criteria
- Authenticated access to database
- Ability to query customer records
- Proof of data extraction capability

## Business Impact
Demonstrates risk to customer data and regulatory compliance obligations
```

### Priority
Importance level:
- **Critical**: Must achieve for engagement success
- **High**: Important but not required
- **Medium**: Nice to have
- **Low**: Stretch goals

### Status
Current progress:
- **Not Started**: No progress yet
- **In Progress**: Actively working
- **Blocked**: Obstacle preventing progress
- **Achieved**: Successfully completed
- **Abandoned**: No longer pursuing

## Types of Objectives

### Access Objectives
Gaining specific access levels:
- User-level access to target systems
- Administrator/root privileges
- Domain Admin in AD environment
- Database access
- Cloud infrastructure access

### Data Objectives
Accessing specific data:
- Customer database records
- Financial information
- Intellectual property
- Configuration files
- Source code
- Email archives

### Persistence Objectives
Maintaining access:
- Create backdoor accounts
- Install persistence mechanisms
- Establish covert channels
- Maintain access post-remediation

### Impact Objectives
Demonstrating potential damage:
- Data exfiltration
- Service disruption
- Privilege escalation
- Lateral movement
- System modification

### Detection Objectives
Testing security controls:
- Bypass endpoint protection
- Evade IDS/IPS
- Avoid SIEM detection
- Test incident response
- Measure detection time

## Tracking Progress

### Status Updates
Update objective status regularly:

**Not Started → In Progress:**
- When you begin working toward objective
- Document initial approach

**In Progress → Achieved:**
- When objective is successfully completed
- Link supporting evidence
- Document achievement method

**In Progress → Blocked:**
- When obstacle prevents progress
- Create blocker entry
- Document what's preventing achievement

### Linking to Findings
Connect objectives to discovered vulnerabilities:
1. Reference objective in finding description
2. Shows how finding relates to goals
3. Demonstrates objective achievement
4. Justifies finding severity

### Evidence Collection
Attach proof of achievement:
- Screenshots showing access
- Command output
- Exfiltrated data samples
- Persistence mechanism proof

## Objective-Driven Testing

### Pre-Engagement Planning
Define objectives before operations begin:

1. **Client consultation**: Understand what client wants tested
2. **Risk assessment**: Identify high-value targets
3. **Threat modeling**: Determine likely attack scenarios
4. **Objective definition**: Create measurable goals

### During Engagement
Use objectives to guide operations:

1. **Prioritize activities**: Focus on objective-related tasks
2. **Progress tracking**: Regular objective status review
3. **Pivoting decisions**: Choose paths that advance objectives
4. **Time management**: Balance effort across objectives

### Scope Drift Detection
Objectives help identify scope drift:

**Signs of drift:**
- Working on tasks unrelated to any objective
- Pursuing interesting but irrelevant vulnerabilities
- Testing systems outside engagement goals
- Spending excessive time on low-priority items

**Course correction:**
1. Review current activities against objectives
2. Identify off-target work
3. Refocus on objectives
4. Document scope changes if needed

## Reporting

### Objective Achievement Summary
Reports include objective section showing:

**For each objective:**
- Status (Achieved/Blocked/Abandoned)
- Achievement method
- Related findings
- Supporting evidence
- Business impact demonstrated

**Overall achievement:**
- Percentage of objectives achieved
- Critical objectives status
- Blockers and challenges
- Lessons learned

### Executive Summary Impact
Objectives link technical findings to business impact:
```
Objective: Access customer database containing PII

Achievement: Successfully accessed database with admin privileges
via SQL injection vulnerability (Finding-001)

Business Impact: Demonstrates risk to customer data, potential
regulatory violations (GDPR, CCPA), and reputational damage
```

## Best Practices

### SMART Objectives
Make objectives Specific, Measurable, Achievable, Relevant, Time-bound:

**Specific**: Clear and unambiguous
```
Good: "Obtain Domain Admin access in CORP.LOCAL domain"
Bad: "Get admin"
```

**Measurable**: Can verify achievement
```
Good: "Extract 1000 customer records from production database"
Bad: "Access some data"
```

**Achievable**: Realistic given time and resources
```
Good: "Escalate from user to admin on web server"
Bad: "Compromise every system in the enterprise"
```

**Relevant**: Aligned with engagement purpose
```
Good: "Access financial data" (for financial systems assessment)
Bad: "Access HR systems" (when testing financial applications)
```

**Time-bound**: Define when objective should be attempted
```
Good: "Week 1: Reconnaissance, Week 2: Initial access, Week 3: Privilege escalation"
Bad: "At some point"
```

### Prioritization
Focus on high-value objectives first:

1. **Critical path**: What must be achieved
2. **Quick wins**: Easy objectives to build momentum
3. **Stretch goals**: Ambitious objectives if time permits
4. **Client priorities**: What client cares most about

### Documentation
Document thoroughly:

**When objective is achieved:**
- How it was achieved
- What findings enabled it
- Evidence collected
- Timestamp of achievement

**When objective is blocked:**
- What prevented achievement
- What was attempted
- What would be needed
- Client notification if relevant

## Common Workflows

### Engagement Planning

1. Meet with client to understand goals
2. Create initial objective list
3. Prioritize objectives (Critical/High/Medium/Low)
4. Review objectives with team
5. Adjust based on feasibility
6. Get client approval
7. Begin operations

### During Operations

1. Review objectives daily
2. Select objective to work toward
3. Plan activities to achieve objective
4. Execute operations
5. Update objective status
6. Link findings to objectives
7. Collect evidence
8. Move to next objective

### Handling Blockers

1. Identify what's preventing objective achievement
2. Create blocker entry in **Tracking → Blockers**
3. Update objective status to "Blocked"
4. Notify client if needed
5. Work on other objectives
6. Revisit when blocker is resolved

### Report Generation

1. Review all objectives
2. Verify status is current
3. Ensure achieved objectives have evidence
4. Document blocked objectives with reasons
5. Include in report's objectives section
6. Link to related findings

## Tips

1. **Define early**: Create objectives before starting operations
2. **Client alignment**: Ensure objectives match client expectations
3. **Measurable goals**: Make success criteria clear
4. **Regular review**: Check progress daily
5. **Evidence immediately**: Collect proof when objectives are achieved
6. **Link findings**: Connect vulnerabilities to objectives
7. **Update status**: Keep status current
8. **Communicate blockers**: Notify client of obstacles
9. **Prioritize realistically**: Don't over-commit
10. **Document everything**: Record what was attempted and why

## Related Features

- [Planning](planning) - AI-assisted objective definition
- [Findings](findings) - Link findings to objectives
- [Evidence](evidence) - Collect proof of achievement
- [Blockers](../user-guide/interface-overview#blockers) - Track obstacles
- [Reports](reports) - Include objective analysis

