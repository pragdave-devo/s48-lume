---
title: "Findings"
description: "Findings are documented vulnerabilities, misconfigurations, and security issues discovered during red team engagements. They form the core of your del"
nav_order: 13
parent: "StrikeKit"
---

![Findings View](../images/Findings.png)
*Findings list showing vulnerabilities sorted by severity*

## Creating a Finding

1. Navigate to **Analysis → Findings**
2. Click **Create Finding**
3. Fill in the finding details

### Required Fields

**Title**: Clear, concise vulnerability description
```
Good:
- "SQL Injection in User Search"
- "Unencrypted Database Credentials in Configuration File"
- "Missing Authentication on Admin API"

Avoid:
- "Security Issue"
- "Problem Found"
- "Vulnerability"
```

**Severity**: Impact level
- **Critical**: Complete system compromise, data breach imminent
- **High**: Significant impact, privilege escalation, sensitive data exposure
- **Medium**: Moderate impact, requires additional exploitation
- **Low**: Minimal impact, defense-in-depth issue
- **Informational**: Observation, best practice recommendation

**Description**: Detailed explanation of the vulnerability
```markdown
## Overview
Brief description of what was found

## Impact
What an attacker could achieve

## Steps to Reproduce
1. Detailed steps to reproduce
2. Include commands or requests
3. Show the result

## Evidence
Reference attached screenshots or artifacts

## Remediation
Specific recommendations to fix
```

### Optional Fields

**Status**:
- **Draft**: Work in progress
- **Review**: Ready for team review
- **Approved**: Confirmed for report
- **Reported**: Included in delivered report

**CVSS Score**: Common Vulnerability Scoring System rating (0.0-10.0)

**Affected Targets**: Link to specific targets from your engagement

**Evidence**: Attach screenshots, logs, or artifacts

**Remediation**: Specific steps to fix the vulnerability

**References**: CVE numbers, blog posts, documentation links

## Sorting Findings

Use the sort controls in the filter bar:

![Findings View](../images/Findings.png)
*Detailed finding view with evidence and remediation*

### By Criticality
Sorts findings by severity (Critical → Informational)

**Use case**: Prioritizing report sections, focusing on high-impact issues

### By Created Time
Sorts by discovery date (newest first)

**Use case**: Tracking recent discoveries, daily status updates

### By Updated Time
Sorts by last modification (newest first)

**Use case**: Seeing what's been recently edited, tracking review progress

## Filtering Findings

### By Severity

Click severity badges to filter:
- Show only Critical findings
- Show only High findings
- Combine with status filters

### By Status

Filter by workflow status:
- Draft (needs completion)
- Review (ready for team)
- Approved (confirmed)
- Reported (delivered)

### Clear Filters

Click **Clear Filters** to reset all filters and show all findings.

## Linking Findings

### To Targets

Link findings to affected systems:

1. In the finding form, select **Affected Targets**
2. Choose one or more targets
3. Target appears in finding details
4. Finding appears on target details page

**Benefits:**
- Shows which systems are vulnerable
- Generates target-specific remediation lists
- Provides context in reports

### To Evidence

Attach proof of vulnerability:

1. Upload evidence to **Analysis → Evidence**
2. In finding form, reference evidence items
3. Evidence thumbnails appear in finding
4. Click to view full evidence

**Types of evidence:**
- Screenshots of exploitation
- Command output logs
- Network packet captures
- Configuration files
- Proof-of-concept code

### To Objectives

Link findings to engagement objectives:

1. Reference objective in finding description
2. Shows how finding relates to goals
3. Demonstrates objective achievement
4. Provides context for severity rating

## Finding Templates

Speed up documentation with templates:

### SQL Injection Template
```markdown
## Overview
SQL injection vulnerability in [PARAMETER] allows arbitrary database queries.

## Impact
- Complete database compromise
- Sensitive data exfiltration
- Potential for remote code execution

## Steps to Reproduce
1. Navigate to [URL]
2. Submit payload: `' OR '1'='1`
3. Observe unauthorized data access

## Evidence
See attached screenshot [EVIDENCE_ID]

## Remediation
1. Use parameterized queries
2. Implement input validation
3. Apply principle of least privilege to database accounts
4. Enable query logging and monitoring
```

### Weak Authentication Template
```markdown
## Overview
[SERVICE] uses weak/default credentials allowing unauthorized access.

## Impact
- Unauthorized system access
- Potential for privilege escalation
- Data exposure risk

## Steps to Reproduce
1. Access [URL/SERVICE]
2. Attempt login with username: [USERNAME]
3. Attempt login with password: [PASSWORD]
4. Observe successful authentication

## Evidence
See attached screenshot [EVIDENCE_ID]

## Remediation
1. Enforce strong password policy
2. Require password change on first login
3. Implement multi-factor authentication
4. Monitor for suspicious authentication attempts
```

## Best Practices

### Writing Quality Findings

1. **Be specific**: Name exact systems, parameters, or configurations
2. **Show impact**: Explain what an attacker could achieve
3. **Provide evidence**: Always include proof
4. **Give actionable remediation**: Specific steps, not just "fix it"
5. **Use consistent formatting**: Follow your organization's template

### Severity Guidelines

**Critical**:
- Remote code execution without authentication
- Database access with admin privileges
- Plaintext passwords in publicly accessible locations
- Complete authentication bypass

**High**:
- Authenticated remote code execution
- SQL injection with data access
- Privilege escalation to admin
- Sensitive data exposure (PII, credentials)

**Medium**:
- Authenticated SQL injection (limited access)
- Cross-site scripting (XSS) with session hijacking
- Information disclosure (system details)
- Missing encryption on sensitive data in transit

**Low**:
- Self-XSS
- Information disclosure (non-sensitive)
- Missing security headers
- Verbose error messages

**Informational**:
- Best practice recommendations
- Defense-in-depth suggestions
- Outdated software (no known exploits)
- Configuration observations

### Review Workflow

Before finalizing findings:

1. **Self-review**: Read as if you're the client
2. **Technical accuracy**: Verify steps to reproduce
3. **Evidence completeness**: Ensure all proof is attached
4. **Remediation clarity**: Verify recommendations are actionable
5. **Consistency**: Check severity ratings align with similar findings

### Report Generation

When preparing for report delivery:

1. Sort by severity (Critical first)
2. Review all Draft findings
3. Move approved findings to Approved status
4. Verify all findings have evidence attached
5. Check target linkage
6. Generate report from **Reporting → Reports**

## Common Workflows

### During Testing

1. Discover vulnerability
2. Immediately create Draft finding
3. Document basic details (title, severity, description)
4. Capture evidence
5. Continue testing
6. Return later to complete details

### During Report Writing

1. Filter for Draft findings
2. Complete missing details
3. Attach all evidence
4. Write clear remediation
5. Change status to Review
6. Team reviews and approves
7. Change status to Approved
8. Generate report

### Post-Delivery

1. Change all included findings to Reported
2. Archive engagement
3. Findings remain in database for reference
4. Use as templates for future engagements

## Tips

1. **Document as you go**: Don't wait until the end to write findings
2. **Draft first, perfect later**: Capture basics immediately, refine during report writing
3. **Use consistent templates**: Maintain quality across findings
4. **Link everything**: Connect findings to targets, evidence, and objectives
5. **Be clear on remediation**: Client should know exactly what to do
6. **Include timelines**: Note if issue requires immediate attention
7. **Consider audience**: Write for both technical and executive readers

## Related Features

- [Evidence](evidence) - Evidence collection
- [Targets](targets) - System tracking
- [Reports](reports) - Report generation
- [MITRE ATT&CK](mitre-attack) - Technique tagging

---

## Next Steps

After documenting findings:

1. **[Attach Evidence](evidence)** - Link supporting proof to findings
2. **[Link to Targets](targets)** - Associate findings with affected systems
3. **[Tag with MITRE ATT&CK](mitre-attack)** - Map to attack techniques
4. **[Generate Reports](reports)** - Create deliverable with all findings

**Related Documentation:**
- [Workflow Guide](../user-guide/workflow#report-generation) - Report preparation process
- [Evidence Collection](evidence) - Proper evidence handling
- [Report Templates](reports#report-templates) - Customize report format

## Video Tutorial

> 📹 **Coming Soon**: Complete guide to documenting findings professionally

## Quick Demo

> 🎬 **GIF**: Creating a finding with evidence

