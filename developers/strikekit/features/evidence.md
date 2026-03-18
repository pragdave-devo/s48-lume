---
title: "Evidence"
description: "Evidence (formerly Artifacts) is proof collected during red team engagements, including screenshots, command output, files, and network captures. Prop"
nav_order: 12
parent: "StrikeKit"
---

![Evidence Collection](../images/Evidence.png)
*Evidence browser showing collected artifacts and proof*

## Why "Evidence"?

The term "Evidence" (versus "Artifacts") emphasizes:
- **Chain of custody**: Timestamped and tamper-proof
- **Legal defensibility**: Professional terminology for reports
- **Proof of compromise**: Supporting documentation for findings
- **Audit trail**: Complete record of engagement activities

## Creating Evidence

1. Navigate to **Analysis → Evidence**
2. Click **Upload Evidence** or **Create Entry**
3. Select evidence type and provide details

## Evidence Types

### Screenshot
Visual proof of access or vulnerability:
- **Image**: PNG, JPG, or GIF file
- **Description**: What the screenshot shows
- **Timestamp**: When captured
- **Source**: Which target or activity

**Common uses:**
- Desktop access proof
- Web application vulnerability
- Configuration interface
- Error messages
- Data exfiltration proof

### Command Output
Terminal or shell command results:
- **Command**: Command executed
- **Output**: Command results (text)
- **Target**: Where executed
- **Agent**: C2 agent ID (if applicable)

**Common uses:**
- System information (`whoami`, `hostname`)
- Enumeration results (`net user`, `ps`)
- File listings (`ls`, `dir`)
- Network information (`ipconfig`, `netstat`)

### File
Downloaded or extracted files:
- **Filename**: Original file name
- **File**: Actual file content
- **Size**: File size
- **Hash**: SHA256 hash for integrity
- **Source**: Where file was obtained

**Common uses:**
- Configuration files (web.config, .env)
- Database backups
- Source code
- Sensitive documents
- Password files

### Network Capture
Packet captures and network traffic:
- **PCAP**: Wireshark/tcpdump capture file
- **Protocol**: HTTP, SMB, LDAP, etc.
- **Summary**: What traffic shows
- **Filter**: Relevant filter for analysis

**Common uses:**
- Cleartext credentials in transit
- Authentication bypass
- Session hijacking
- Data exfiltration
- Command and control traffic

### Log File
System or application logs:
- **Log Type**: System, application, security
- **Content**: Log entries
- **Timeframe**: Log date range
- **Source**: System generating logs

**Common uses:**
- Authentication logs
- Error logs revealing vulnerabilities
- Audit logs
- Access logs

## Auto-Collection

Evidence is automatically collected from:

### C2 Operations
- Screenshot command output
- Download command results
- All command responses (if significant)
- Agent metadata

### Reconnaissance
- Scan results
- Enumeration output
- OSINT findings
- Service banners

### Manual Capture
- Upload files directly
- Paste command output
- Drag-and-drop screenshots

## Evidence Metadata

### Required Fields

**Type**: Screenshot, Command Output, File, Network Capture, Log

**Description**: What this evidence shows
```
Good:
- "Proof of Administrator access to FILESERVER01"
- "SQL injection in user search parameter"
- "Plaintext database credentials in web.config"

Avoid:
- "Screenshot"
- "File"
- "Evidence"
```

### Important Fields

**Timestamp**: When evidence was collected
- Auto-set for C2 operations
- Manually set for manual uploads
- Critical for chain of custody

**Target**: Associated target (if applicable)
- Links evidence to specific system
- Shows evidence in target details
- Provides context for findings

**Finding**: Related finding (if applicable)
- Links evidence to vulnerability
- Shows evidence in finding documentation
- Supports finding severity rating

**Tags**: Categorize evidence
```
Examples:
- critical
- credential-exposure
- privilege-escalation
- data-exfiltration
- proof-of-access
```

### Chain of Custody Fields

**Collected By**: Who collected the evidence
- Auto-populated from user context
- Required for legal defensibility

**Collection Method**: How evidence was obtained
- C2 command
- Manual screenshot
- Network capture
- File download

**Hash**: SHA256 hash of file evidence
- Auto-calculated for files
- Ensures integrity
- Detects tampering

## Linking Evidence

### To Findings

Attach evidence to vulnerability documentation:

1. When creating/editing finding, click **Add Evidence**
2. Select evidence items from list
3. Evidence thumbnails appear in finding
4. Click evidence to view full version

**Best practice:**
- Every finding should have supporting evidence
- Use multiple evidence items if needed
- Screenshots alone aren't always sufficient

### To Targets

Associate evidence with specific targets:

1. In evidence details, select **Target**
2. Choose relevant target from list
3. Evidence appears in target's evidence list
4. Provides complete target picture

### To Activities

Link evidence to engagement activities:

1. Evidence automatically linked from C2 operations
2. Manually link when uploading
3. Shows evidence in timeline
4. Provides context in kill chain

## Evidence Organization

### By Type
Filter by evidence type:
- Screenshots only
- Command outputs
- Files
- Network captures
- Logs

### By Target
View evidence per target:
- Show all evidence from specific host
- Group by network
- Filter by compromise status

### By Finding
View evidence per finding:
- Show supporting evidence for finding
- Verify completeness
- Ensure sufficient proof

### By Date
Sort chronologically:
- Recent evidence first
- Group by engagement phase
- Timeline correlation

### Search
Search by:
- Description
- Filename
- Tags
- Command
- Target name

## Evidence Storage

### File Storage

Evidence is stored securely:
- **Location**: Database BLOB storage
- **Encryption**: Encrypted at rest
- **Integrity**: SHA256 hashing
- **Backup**: Included in database backups

### Size Limits

Be mindful of storage:
- **Screenshots**: Compress to reasonable size (PNG recommended)
- **Command output**: Text-only, minimal size
- **Files**: Large files increase database size
- **PCAPs**: Consider storing externally and linking

### Retention

Evidence is retained:
- Throughout engagement
- During report generation
- Post-engagement per agreement
- Until explicitly deleted

## Evidence Review

### Pre-Report Review

Before generating reports:

1. **Completeness check**:
   - Every finding has supporting evidence
   - Evidence is clearly labeled
   - Timestamps are accurate

2. **Quality check**:
   - Screenshots are readable
   - Command outputs are complete
   - Files are relevant
   - No sensitive data exposure (PII, corporate secrets)

3. **Organization**:
   - Evidence is properly tagged
   - Linked to correct findings
   - Target associations are correct

### Sanitization

Before including in reports:

1. **Redact sensitive information**:
   - Personal information (PII)
   - Credentials (unless necessary for finding)
   - Corporate confidential data
   - Employee information

2. **Crop screenshots**:
   - Remove irrelevant portions
   - Focus on relevant information
   - Maintain context

3. **Anonymize if required**:
   - Replace usernames with generic identifiers
   - Mask IP addresses if needed
   - Follow client requirements

## Evidence in Reports

### Report Integration

Evidence appears in generated reports:

**Finding sections:**
- Embedded screenshots
- Referenced command output
- Linked file downloads
- PCAP analysis summaries

**Appendices:**
- Complete evidence catalog
- Full command outputs
- Technical details
- Raw data

**Executive summary:**
- Key screenshots showing impact
- Proof of access
- Critical findings evidence

### Evidence References

Reference evidence clearly in findings:
```
Good:
"As shown in Screenshot EV-123, administrative access was achieved..."
"The configuration file (EV-456) contained plaintext credentials..."
"Network capture EV-789 demonstrates cleartext authentication..."

Include:
- Evidence ID or reference
- What evidence shows
- Why it's relevant
- How to interpret
```

## Best Practices

### Collection

1. **Collect immediately**: Capture evidence as you work
2. **Multiple angles**: Take multiple screenshots if needed
3. **Context matters**: Include enough context to understand evidence
4. **Timestamps**: Ensure timestamps are accurate
5. **Quality over quantity**: Relevant evidence, not everything

### Documentation

1. **Clear descriptions**: Explain what evidence shows
2. **Proper labeling**: Use consistent naming
3. **Complete metadata**: Fill in all relevant fields
4. **Linking**: Connect to targets and findings
5. **Chain of custody**: Maintain integrity

### Organization

1. **Tag consistently**: Use same tag names across engagement
2. **Group logically**: Organize by finding or target
3. **Review regularly**: Ensure nothing is missing
4. **Clean up**: Remove duplicates or unnecessary evidence

### Security

1. **Protect sensitive data**: Handle responsibly
2. **Encrypt storage**: Use encrypted database
3. **Access control**: Limit who can view/modify
4. **Secure transmission**: Encrypt when sharing
5. **Proper disposal**: Delete per agreement

## Common Workflows

### During Exploitation

1. Attempt exploitation
2. If successful, immediately capture evidence:
   - Screenshot of access
   - Command output showing success
   - Configuration file if relevant
3. Create evidence entry
4. Link to target
5. Tag appropriately
6. Continue operation

### During Reconnaissance

1. Run reconnaissance tools
2. Save output as evidence:
   - Scan results
   - Enumeration output
   - Service banners
3. Link to discovered targets
4. Tag for later analysis
5. Reference in activities

### During Report Writing

1. Review all findings
2. For each finding:
   - Verify supporting evidence exists
   - Review evidence quality
   - Ensure evidence is linked
   - Sanitize if necessary
3. Add missing evidence if needed
4. Generate report with evidence

### Post-Engagement

1. Archive all evidence
2. Provide evidence package to client (if requested)
3. Retain per agreement
4. Secure disposal after retention period

## Tips

1. **Screenshot early**: Capture evidence before it disappears
2. **Multiple formats**: Use screenshots AND command output
3. **Full context**: Include enough information to understand evidence
4. **Timestamp accuracy**: Verify timestamps are correct
5. **Hash verification**: Use hashes for file integrity
6. **Organize as you go**: Don't batch-organize at the end
7. **Link immediately**: Connect evidence to findings/targets right away
8. **Quality control**: Review evidence clarity and relevance
9. **Sanitize appropriately**: Remove sensitive data before sharing
10. **Archive properly**: Store securely for future reference

## Troubleshooting

### Evidence Upload Failed

If upload fails:
1. Check file size (may exceed limit)
2. Verify file format is supported
3. Check database storage space
4. Try compressing large files
5. Contact support if persistent

### Evidence Not Appearing in Finding

If evidence doesn't show in finding:
1. Verify evidence is linked to finding
2. Check finding status (draft vs approved)
3. Refresh the page
4. Verify evidence wasn't accidentally deleted

### Evidence Integrity Issues

If hash doesn't match:
1. Evidence may have been modified
2. Check file corruption
3. Review access logs
4. Consider re-collecting evidence

## Related Features

- [Findings](findings) - Link evidence to vulnerabilities
- [Targets](targets) - Associate evidence with targets
- [C2](c2) - Auto-collect from C2 operations
- [Reports](reports) - Include evidence in deliverables
- [Timeline](timeline) - Evidence timestamps in chronology

