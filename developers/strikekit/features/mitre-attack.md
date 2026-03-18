---
title: "MITRE ATT&CK"
description: "Technique mapping and coverage tracking using the MITRE ATT&CK framework for comprehensive reporting."
nav_order: 15
parent: "StrikeKit"
---

## Overview

The MITRE ATT&CK integration provides:
- Complete ATT&CK framework database
- Technique tagging for activities
- Coverage visualization
- Report integration
- Detection recommendations

## Accessing MITRE ATT&CK

![MITRE ATT&CK Matrix](../images/MITRE%20ATT&CK.png)
*MITRE ATT&CK framework with technique mapping*

Navigate to **Reporting → MITRE ATT&CK** to browse techniques and view coverage.

## ATT&CK Framework Structure

### Tactics
High-level adversary goals:
- Reconnaissance
- Initial Access
- Execution
- Persistence
- Privilege Escalation
- Defense Evasion
- Credential Access
- Discovery
- Lateral Movement
- Collection
- Command and Control
- Exfiltration
- Impact

### Techniques
Specific methods to achieve tactical goals:
- Each tactic contains multiple techniques
- Techniques have sub-techniques
- Includes descriptions and examples
- Links to mitigations and detections

## Tagging Activities

### Manual Tagging

1. Create or edit activity
2. Select MITRE ATT&CK technique
3. Choose sub-technique if applicable
4. Activity now tagged with technique

### Auto-Tagging

StrikeKit automatically suggests techniques based on:
- Activity description
- Commands executed
- Tools used
- Target systems

### Bulk Tagging

Tag multiple activities at once:
1. Select activities
2. Apply technique tag
3. All activities tagged simultaneously

## Coverage Visualization

### ATT&CK Matrix

Visual matrix showing:
- Techniques used (highlighted)
- Coverage by tactic
- Frequency of technique use
- Gaps in coverage

### Coverage Reports

Generate reports showing:
- Percentage coverage per tactic
- Most-used techniques
- Comparison to common adversary groups
- Detection opportunities

## Detection Mapping

For each technique used:
- View detection recommendations
- See data sources needed
- Review detection analytics
- Link to MITRE references

## Reporting Integration

MITRE ATT&CK data appears in reports:

### Executive Summary
- High-level tactic coverage
- Comparison to real-world threats

### Technical Section
- Detailed technique usage
- Complete ATT&CK matrix
- Technique descriptions
- Detection recommendations

### Methodology
- Framework-based testing approach
- Systematic coverage
- Industry-standard terminology

## Best Practices

### Tagging Guidelines

1. **Tag immediately**: Add techniques when performing activities
2. **Be specific**: Use sub-techniques when applicable
3. **Multiple techniques**: Tag with all relevant techniques
4. **Consistent tagging**: Use same techniques for similar activities

### Coverage Goals

Aim for:
- At least one technique per relevant tactic
- Multiple techniques for key tactics
- Balanced coverage across lifecycle
- Realistic adversary simulation

### Detection Focus

Use ATT&CK for:
- Identifying detection gaps
- Recommending monitoring improvements
- Testing detection capabilities
- Measuring detection coverage

## Common Workflows

### During Operations

1. Perform activity
2. Tag with ATT&CK technique immediately
3. Note if detection occurred
4. Link to related findings

### Report Preparation

1. Review ATT&CK coverage
2. Ensure all activities tagged
3. Generate coverage matrix
4. Include in technical report
5. Highlight detection gaps

### Client Recommendations

Use ATT&CK data to recommend:
- Detection improvements
- Monitoring priorities
- Security control gaps
- Training focus areas

## Tips

1. **Learn the framework**: Familiarize yourself with common techniques
2. **Use search**: Search for techniques by name or ID
3. **Reference descriptions**: Read technique details for accurate tagging
4. **Track detections**: Note when your activities were detected
5. **Compare to threats**: Show how your testing relates to real adversaries
6. **Focus on gaps**: Identify uncovered techniques and explain why

## Related Features

- [Timeline](timeline) - Activities linked to ATT&CK
- [Kill Chain](kill-chain) - Attack progression
- [Reports](reports) - ATT&CK coverage in deliverables
- [Findings](findings) - Link techniques to vulnerabilities

