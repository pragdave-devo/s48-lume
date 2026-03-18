---
title: "Recommended Workflow"
description: "This guide outlines the recommended workflow for conducting red team engagements with StrikeKit, organized as a logical progression from planning thro"
nav_order: 5
parent: "StrikeKit"
---

## Feature Relationship Diagram

Understanding how features connect throughout the engagement lifecycle:

```
┌─────────────────────────────────────────────────────────────┐
│                    ENGAGEMENT LIFECYCLE                      │
└─────────────────────────────────────────────────────────────┘

 Pre-Engagement                Active Operations              Post-Engagement
 ──────────────                ─────────────────              ───────────────
      │                              │                              │
      │                              │                              │
      ▼                              ▼                              ▼
 Engagements ──────┐          Reconnaissance                   Reports
      │            │               │                              ▲
      │            │               ▼                              │
      ▼            │          Targets ──────┐                     │
 Objectives        │               │        │                     │
      │            ▼               ▼        ▼                     │
      │        Planning      Credentials   Evidence ─────────────┤
      │            │               │          ▲                   │
      │            ▼               │          │                   │
      │       Checklists           │          │                   │
      │            │               │          │                   │
      └────────────┼───────────────┼──────────┼───────────────────┤
                   │               │          │                   │
                   ▼               ▼          │                   │
              Execution ──────> C2 Ops ───────┤                   │
                   │               │          │                   │
                   │               ▼          │                   │
                   │          Activities      │                   │
                   │               │          │                   │
                   │               └──────────┤                   │
                   │                          │                   │
                   ▼                          ▼                   │
              Blockers                   Kill Chain               │
                                             │                    │
                                             ▼                    │
                                        Timeline ─────────────────┤
                                             │                    │
                                             ▼                    │
                                        Findings ─────────────────┤
                                             │                    │
                                             ▼                    │
                                      MITRE ATT&CK ──────────────┤
                                             │                    │
                                             ▼                    │
                                         Notes ────────────────────┘


Key Connections:
├── Engagements → Objectives → Execution → Findings → Reports
├── Targets → Credentials → Evidence → Findings
├── C2 Ops → Activities → Kill Chain → Timeline
├── Activities → MITRE ATT&CK → Reports
└── Evidence + Findings + MITRE ATT&CK → Reports
```

## How Features Work Together

**Planning Flow:**
1. Create **Engagement** with scope and ROE
2. Define **Objectives** for success criteria
3. Use **Planning** assistant for structured approach
4. Review **Checklists** for methodology

**Operational Flow:**
1. Start **Execution** monitoring
2. Perform **Reconnaissance** to discover **Targets**
3. Use **C2** for operations, collecting **Credentials** and **Evidence**
4. Document progress in **Kill Chain** and **Timeline**
5. Handle obstacles with **Blockers**

**Documentation Flow:**
1. Create **Findings** for discovered vulnerabilities
2. Attach **Evidence** to support findings
3. Tag activities with **MITRE ATT&CK** techniques
4. Use **Notes** for context and observations

**Reporting Flow:**
1. Review **Objectives** achievement
2. Organize **Findings** by severity
3. Include **Evidence** and **MITRE ATT&CK** coverage
4. Generate **Reports** from collected data

## Phase 1: Situation (Pre-Engagement)

### 1. Create Engagement

Navigate to **Headquarters → Engagements** and create a new engagement:

- Define scope (IP ranges, domains, systems)
- Set Rules of Engagement (ROE)
- Specify engagement dates
- Document client information
- Choose engagement type

### 2. Set Objectives

Go to **Mission → Objectives** and define clear goals:

- What are you trying to demonstrate?
- What systems are high-value targets?
- What access level constitutes success?
- What data should you prioritize?

### 3. Review Checklists

Visit **Mission → Checklists** to review methodology:

- Select appropriate checklist (External/Internal/Web App/AD)
- Familiarize yourself with the steps
- Identify any custom checks needed

---

## Phase 2: Mission (Planning)

### 4. AI-Assisted Planning

Use **Mission → Planning** for structured walkthrough:

- Clarify scope boundaries
- Identify potential risks
- Plan resource allocation
- Establish communication protocols
- Review approval gates

### 5. Prepare Templates

If using **Headquarters → Templates**:

- Apply engagement template
- Review pre-configured objectives
- Customize checklists
- Set up initial targets

---

## Phase 3: Execution (Active Operations)

### 6. Reconnaissance

Start with **Toolkit → Reconnaissance**:

- Run automated discovery
- Collect OSINT
- Enumerate services
- Results auto-populate **Intelligence → Targets**

### 7. Initial Access

As you gain access:

- Document targets in **Intelligence → Targets**
- Store credentials in **Analysis → Credentials**
- Capture evidence in **Analysis → Evidence**
- Track progression in **Tracking → Kill Chain**

### 8. Execution Monitoring

Use **Mission → Execution** to:

- Start engagement activities
- Monitor operation progress
- Handle approval gates (out-of-scope, risky actions)
- Track real-time status

### 9. Lateral Movement

Track your path through **Mission → Pivot Chains**:

- Document hop-by-hop progression
- Identify blockers
- Map compromise chains
- Visualize attack paths

### 10. Post-Exploitation

As you achieve objectives:

- Collect evidence of compromise
- Document privilege escalation paths
- Capture sensitive data access
- Screenshot proof of access

### 11. Document Findings

Record vulnerabilities in **Analysis → Findings**:

- Describe the vulnerability
- Assign severity (Critical/High/Medium/Low/Info)
- Link to affected targets
- Attach supporting evidence
- Note remediation recommendations

---

## Phase 4: Admin & Logistics (Ongoing)

### 12. Track Progress

Monitor engagement health:

- **Tracking → Timeline**: Review chronological events
- **Tracking → Kill Chain**: Check phase progression
- **Tracking → Audit Log**: Verify complete action history
- **Headquarters → Dashboard**: Overview metrics

### 13. Handle Blockers

Address obstacles in **Tracking → Blockers**:

- Technical blockers (failed exploits, missing credentials)
- Approval required (out-of-scope targets)
- Client notifications needed

### 14. Take Notes

Use **Reporting → Notes** for:

- Technical observations
- Strange behaviors
- Questions for client
- Ideas for report
- Link notes to targets and findings

### 15. Tag Techniques

Map activities in **Reporting → MITRE ATT&CK**:

- Tag activities with MITRE techniques
- Track tactic coverage
- Generate technique matrices for reports

---

## Phase 5: Command & Signal (Reporting)

### 16. Review Findings

Before generating reports:

- Sort findings by severity in **Analysis → Findings**
- Ensure all findings have evidence attached
- Verify target linkage
- Check for completeness

### 17. Visualize Attack Path

Use **Analysis → Network Topology** to:

- Show discovered infrastructure
- Highlight pivot chains
- Demonstrate attack progression
- Include in executive summary

### 18. Generate Reports

Navigate to **Reporting → Reports**:

- Generate executive summary
- Create technical findings report
- Include MITRE ATT&CK coverage
- Export to PDF
- Review before delivery

### 19. Client Debrief

Prepare for client presentation:

- Dashboard overview (**Headquarters → Dashboard**)
- Kill Chain progression (**Tracking → Kill Chain**)
- Network topology visualization (**Analysis → Network Topology**)
- Key findings walkthrough (**Analysis → Findings**)

---

## Best Practices

### During Engagement

1. **Document as You Go**: Don't wait until the end to record findings
2. **Link Everything**: Connect findings to targets, evidence, and objectives
3. **Capture Evidence Immediately**: Screenshot/log output right after success
4. **Use Pivot Chains**: Visualize your attack path for better reporting
5. **Monitor Kill Chain**: Ensure balanced coverage across phases
6. **Check Objectives**: Regularly verify you're on track for goals

### For Quality Reports

1. **Consistent Severity Ratings**: Use the same criteria across findings
2. **Clear Descriptions**: Write findings for both technical and executive audiences
3. **Complete Evidence**: Every finding should have supporting proof
4. **Remediation Focus**: Include actionable recommendations
5. **MITRE Mapping**: Tag techniques for industry-standard reporting

### Engagement Management

1. **Daily Status Updates**: Review dashboard daily
2. **Blockers First**: Address blockers immediately
3. **Timeline Accuracy**: Keep timeline updated with major events
4. **Audit Trail**: Rely on audit log for complete action history
5. **Checklist Discipline**: Follow methodology checklists systematically

---

## Common Workflows

### External Pentest

1. Create engagement with external scope
2. Run reconnaissance (OSINT, scanning)
3. Identify vulnerabilities in exposed services
4. Attempt exploitation
5. Document findings and evidence
6. Generate report

### Internal Assessment

1. Create engagement with internal scope
2. Passive reconnaissance (network sniffing)
3. Active scanning of internal network
4. Privilege escalation attempts
5. Lateral movement and pivot tracking
6. AD enumeration and attack paths
7. Document findings with pivot chains
8. Generate comprehensive report

### Web Application Test

1. Create engagement with web app scope
2. Manual/automated vulnerability scanning
3. Test authentication and authorization
4. Test input validation and injection
5. Test business logic flaws
6. Document findings with screenshots
7. Generate web-specific report

---

## Next Steps

- [Learn about Engagements](../features/engagements)
- [Explore Planning features](../features/planning)
- [Set up C2 infrastructure](../features/c2)
- [Document your first finding](../features/findings)

