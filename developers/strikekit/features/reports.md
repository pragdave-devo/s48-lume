---
title: "Reports"
description: "Reports are the primary deliverable for red team engagements, transforming collected data into professional documentation for clients."
nav_order: 19
parent: "StrikeKit"
---

## Report Types

![Reports Interface](../images/Reports.png)
*Report generation and export with multiple formats*

### Executive Summary
High-level overview for non-technical audiences:
- **Engagement scope and dates**
- **Key findings summary**
- **Risk assessment**
- **Overall security posture**
- **High-level recommendations**

**Audience**: C-level executives, management, board members

### Technical Report
Detailed findings for technical teams:
- **Complete finding descriptions**
- **Steps to reproduce**
- **Technical evidence**
- **Detailed remediation steps**
- **MITRE ATT&CK mapping**

**Audience**: Security teams, system administrators, developers

### Methodology Report
Documentation of testing approach:
- **Testing scope**
- **Tools and techniques used**
- **Kill chain progression**
- **Timeline of activities**
- **Checklist completion**

**Audience**: Security teams, auditors, compliance officers

## Generating Reports

1. Navigate to **Reporting → Reports**
2. Click **Generate Report**
3. Select report type(s)
4. Configure report options
5. Click **Generate**

### Report Options

**Include sections:**
- Executive summary
- Methodology
- Findings (with evidence)
- Network topology
- Kill chain analysis
- MITRE ATT&CK coverage
- Appendices

**Severity filter:**
- All findings
- Critical and High only
- Exclude Informational

**Evidence inclusion:**
- Embed screenshots
- Link to evidence
- Appendix only
- Exclude evidence

**Format:**
- PDF (default)
- Markdown
- HTML
- DOCX (coming soon)

## Report Structure

### Cover Page
- Report title
- Client name
- Engagement dates
- Report version and date
- Prepared by
- Classification marking

### Executive Summary
- Engagement overview
- Scope definition
- Key statistics
  - Targets discovered
  - Vulnerabilities identified
  - Credentials captured
  - Systems compromised
- Finding severity breakdown (chart)
- Critical findings highlight
- Risk assessment
- High-level recommendations

### Methodology
- Engagement approach
- Testing methodology
- Tools and techniques
- Scope and limitations
- Timeline overview
- Kill chain progression

### Findings

For each finding:
- Title
- Severity rating
- CVSS score (if applicable)
- Affected systems
- Description
- Impact analysis
- Steps to reproduce
- Evidence (screenshots, output)
- Remediation recommendations
- References (CVE, vendor docs)

Organized by:
- Severity (Critical → Informational)
- Or by category (Web, Network, System, etc.)

### Network Topology
- Network diagram showing:
  - Discovered infrastructure
  - Compromised systems
  - Lateral movement paths
  - Attack progression

### MITRE ATT&CK Analysis
- Techniques observed
- Tactic coverage
- Technique frequency
- ATT&CK matrix visualization

### Remediation Roadmap
- Prioritized remediation plan
- Quick wins (easy, high-impact fixes)
- Long-term improvements
- Defense-in-depth recommendations

### Appendices
- Complete evidence catalog
- Full command outputs
- Tool outputs
- Vulnerability details
- Glossary of terms

## Report Templates

### Creating Templates

1. Navigate to **Reporting → Reports**
2. Go to **Templates** tab
3. Click **Create Template**
4. Configure template settings:
   - Template name
   - Default sections
   - Formatting preferences
   - Header/footer content
   - Branding (logo, colors)

### Template Components

**Header:**
- Company logo
- Report title
- Classification marking
- Page numbers

**Footer:**
- Copyright notice
- Confidentiality statement
- Contact information
- Page numbers

**Styling:**
- Font families
- Color scheme
- Heading styles
- Code block formatting

**Sections:**
- Which sections to include by default
- Section ordering
- Custom sections

### Applying Templates

When generating report:
1. Select template from dropdown
2. Template applies:
   - Formatting
   - Branding
   - Default sections
   - Styling
3. Override options if needed
4. Generate report

## Report Customization

### Custom Sections

Add engagement-specific sections:

**Common additions:**
- Client-specific context
- Special testing scenarios
- Engagement challenges
- Lessons learned
- Future testing recommendations

### Branding

Customize report appearance:
- Add company logo
- Apply color scheme
- Custom fonts
- Watermarks
- Classification banners

### Formatting

Adjust formatting:
- Page size (A4, Letter)
- Margins
- Line spacing
- Code block styles
- Screenshot sizing

## Report Review

### Pre-Generation Checklist

Before generating final report:

1. **Findings review:**
   - [ ] All findings have clear titles
   - [ ] Severity ratings are consistent
   - [ ] Evidence is attached
   - [ ] Remediation is actionable
   - [ ] Steps to reproduce are complete

2. **Evidence review:**
   - [ ] All evidence is linked
   - [ ] Screenshots are clear and readable
   - [ ] Sensitive data is redacted
   - [ ] Evidence descriptions are clear

3. **Content review:**
   - [ ] Scope is accurately documented
   - [ ] Timeline is complete
   - [ ] Kill chain shows progression
   - [ ] Network topology is accurate
   - [ ] MITRE mapping is complete

4. **Quality review:**
   - [ ] Grammar and spelling checked
   - [ ] Technical accuracy verified
   - [ ] Consistent terminology
   - [ ] Appropriate audience level

### Peer Review

Have another team member review:
- Technical accuracy
- Finding severity ratings
- Remediation recommendations
- Report clarity and completeness
- Professional presentation

### Client Review (Optional)

For preliminary reports:
- Share draft with client
- Gather feedback
- Address questions
- Clarify findings
- Adjust recommendations

## Report Delivery

### PDF Generation

Generate final PDF:
1. Review all content
2. Select final template
3. Generate PDF
4. Save with clear filename:
   ```
   ClientName_RedTeam_Report_YYYY-MM-DD_v1.0.pdf
   ```

### Encryption

For sensitive reports:
1. Encrypt PDF with password
2. Use strong password
3. Share password via separate channel
4. Document encryption method

### Delivery Methods

**Secure file transfer:**
- Encrypted email
- Secure file sharing platform
- Client portal upload
- In-person delivery

**Versioning:**
```
v0.1 - Draft for internal review
v0.5 - Draft for client review
v1.0 - Final approved report
v1.1 - Addendum after client questions
```

## Report Sections Detail

### Executive Summary Guidelines

**Length**: 1-2 pages

**Language**: Non-technical, business-focused

**Content:**
- What was tested
- What was found
- Why it matters
- What to do about it

**Avoid:**
- Technical jargon
- Detailed exploitation steps
- Tool names
- Command syntax

**Example structure:**
```
[Client] engaged [Company] to perform a red team assessment
from [Start Date] to [End Date].

The assessment identified [X] critical and [Y] high-severity
findings that could allow unauthorized access to sensitive data
and systems.

Key findings include:
1. [Critical Finding 1]
2. [Critical Finding 2]
3. [High Finding 1]

Immediate action is recommended to address critical findings.
```

### Technical Findings Guidelines

**Title**: Clear, specific vulnerability name

**Severity**: Justified rating based on impact and exploitability

**Description**:
- What the vulnerability is
- Where it exists
- How it was discovered

**Impact**:
- What attacker could achieve
- Business impact
- Data at risk

**Evidence**:
- Screenshots showing vulnerability
- Command output
- Proof of exploitation

**Remediation**:
- Specific, actionable steps
- Priority level
- Estimated effort
- References to best practices

### Network Topology Guidelines

Include:
- All discovered systems
- Network boundaries
- Compromised systems (highlighted)
- Lateral movement paths
- Initial access point
- Final position

Use color coding:
- Green: Scanned but not compromised
- Yellow: Compromised with user privileges
- Red: Compromised with admin privileges
- Gray: Out of scope

### MITRE ATT&CK Guidelines

Include:
- Complete ATT&CK matrix with observed techniques
- Technique descriptions
- How each technique was used
- Affected systems
- Detection opportunities

## Best Practices

### Writing Style

1. **Clear and concise**: Get to the point
2. **Audience-appropriate**: Technical for tech teams, business language for executives
3. **Objective**: Present facts, not opinions
4. **Professional**: Formal tone throughout
5. **Consistent**: Use same terms and formats throughout

### Finding Descriptions

1. **Specific**: Name exact systems, parameters, or configurations
2. **Complete**: Include all information needed to understand
3. **Evidence-based**: Support every claim with evidence
4. **Actionable**: Provide clear remediation steps
5. **Prioritized**: Focus on impact and risk

### Remediation Recommendations

1. **Specific**: Exact steps, not generic advice
2. **Prioritized**: Critical items first
3. **Realistic**: Consider client's environment
4. **Defense-in-depth**: Multiple layers of security
5. **Verifiable**: Include how to test the fix

### Report Quality

1. **Proofread**: Check grammar and spelling
2. **Verify**: Double-check all technical details
3. **Format**: Consistent formatting throughout
4. **Complete**: No missing sections or TBDs
5. **Professional**: High-quality presentation

## Common Workflows

### Draft Report

1. Complete all findings documentation
2. Link all evidence
3. Generate draft report (internal review only)
4. Review with team
5. Make corrections
6. Prepare for client

### Client Draft

1. Generate client-facing draft
2. Mark as "DRAFT" on every page
3. Share with client for initial feedback
4. Schedule review meeting
5. Address questions
6. Make revisions

### Final Report

1. Incorporate all feedback
2. Final technical review
3. Final writing review
4. Generate final PDF
5. Remove "DRAFT" marking
6. Add version number (v1.0)
7. Encrypt if required
8. Deliver to client

### Post-Delivery Updates

If client has questions:
1. Document questions and answers
2. Generate addendum if needed
3. Increment version (v1.1)
4. Deliver updated report

## Tips

1. **Start early**: Begin report during engagement, not after
2. **Document as you go**: Write finding descriptions when found
3. **Multiple reviews**: Have multiple people review before delivery
4. **Save versions**: Keep all draft versions for reference
5. **Template consistency**: Use same template across engagements
6. **Executive summary last**: Write after technical sections complete
7. **Visual aids**: Use charts, graphs, and diagrams
8. **Clear evidence**: Ensure all screenshots are readable
9. **Client focus**: Write for the client, not for yourself
10. **Professional polish**: Spend time on formatting and presentation

## Related Features

- [Findings](findings) - Document vulnerabilities for reports
- [Evidence](evidence) - Collect supporting proof
- [Kill Chain](kill-chain) - Show attack progression
- [Network Topology](network-topology) - Visualize infrastructure
- [MITRE ATT&CK](mitre-attack) - Technique mapping

