---
title: "Notes"
description: "Engagement-wide note-taking with tagging and linking support for documenting observations, ideas, and context throughout the engagement."
nav_order: 20
parent: "StrikeKit"
---

## Overview

Notes provide flexible documentation for:
- Technical observations
- Ideas and hypotheses
- Questions for the client
- Temporary findings
- Context and background
- Team communications

## Creating Notes

![Notes Interface](../images/Notes.png)
*Note-taking with tags and cross-references*

1. Navigate to **Reporting → Notes**
2. Click **Create Note**
3. Write note content
4. Add tags and links
5. Save

## Note Types

### Technical Notes
Document technical observations:
```
- "SMB signing disabled on file servers"
- "Web app uses outdated jQuery version"
- "Firewall allows outbound DNS on all ports"
```

### Operational Notes
Track engagement logistics:
```
- "Client requested testing pause Dec 20-31"
- "VPN credentials expire in 3 days"
- "Need client approval before database access"
```

### Analysis Notes
Record analysis and hypotheses:
```
- "Password pattern suggests default policy"
- "Network segmentation appears non-existent"
- "Multiple services running as SYSTEM"
```

### Question Notes
Track questions for client:
```
- "Is X.X.X.X subnet in scope?"
- "Can we test admin portal after hours?"
- "Who is responsible for patch management?"
```

## Note Features

### Rich Text Editing

Notes support:
- **Bold**, *italic*, `code`
- Bulleted and numbered lists
- Code blocks with syntax highlighting
- Links to URLs
- Inline images

### Tagging

Organize notes with tags:
```
Tags:
- technical
- needs-clarification
- high-priority
- for-report
- client-question
```

Filter notes by tag for quick access.

### Linking

Link notes to engagement items:
- **Targets**: Notes about specific systems
- **Findings**: Context for vulnerabilities
- **Objectives**: Notes related to goals
- **Activities**: Observations during operations

### Search

Find notes quickly:
- Full-text search
- Search by tags
- Search by linked items
- Date range filters

## Organization

### By Phase

Organize notes by engagement phase:
- Reconnaissance notes
- Initial access notes
- Post-exploitation notes
- Report preparation notes

### By Category

Group by purpose:
- Technical findings (potential report content)
- Questions (need answers)
- Ideas (future testing)
- Context (background information)

### By Priority

Tag for urgency:
- `urgent` - Immediate attention needed
- `high-priority` - Address soon
- `low-priority` - Nice to have
- `reference` - For future use

## Common Workflows

### During Testing

1. Make quick notes as you work
2. Tag appropriately
3. Link to relevant targets
4. Review daily for action items

### Converting to Findings

When note becomes a finding:
1. Create proper finding
2. Use note content as starting point
3. Add evidence and details
4. Link finding to note for reference
5. Tag note as `converted-to-finding`

### Client Questions

1. Tag note as `client-question`
2. Review before client meetings
3. Document answers in same note
4. Update related items based on answers

### Report Writing

1. Filter for `for-report` tag
2. Review technical notes
3. Incorporate into findings
4. Use as context for report sections

## Best Practices

### During Engagement

1. **Write immediately**: Capture thoughts when they occur
2. **Be concise**: Short notes are easier to review
3. **Tag consistently**: Use same tag names throughout
4. **Link everything**: Connect notes to related items
5. **Review regularly**: Don't let notes pile up

### Note Quality

1. **Clear titles**: Make notes easy to find
2. **Sufficient detail**: Include enough context
3. **Actionable**: Note what needs to be done
4. **Timestamped**: Automatic, but check for accuracy

### Organization

1. **Regular cleanup**: Review and organize notes weekly
2. **Archive old notes**: Remove outdated information
3. **Consolidate**: Merge related notes when appropriate
4. **Action items**: Flag notes requiring follow-up

## Tips

1. **Quick capture**: Don't worry about perfect formatting initially
2. **Refine later**: Clean up notes during downtime
3. **Use templates**: Create note templates for common types
4. **Share context**: Link notes to provide context for findings
5. **Question tracking**: Use notes to track all client questions
6. **Daily review**: Spend 10 minutes daily reviewing notes
7. **Tag liberally**: Better to over-tag than under-tag
8. **Search frequently**: Use search instead of scrolling

## Integration with Reporting

Notes enhance reports by:
- Providing context for findings
- Documenting methodology decisions
- Recording client interactions
- Explaining unusual observations
- Supporting technical details

## Related Features

- [Findings](findings) - Convert notes to formal findings
- [Evidence](evidence) - Link notes to supporting proof
- [Targets](targets) - Target-specific observations
- [Timeline](timeline) - Chronological context
- [Reports](reports) - Use notes for report content

