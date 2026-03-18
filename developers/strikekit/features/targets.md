---
title: "Targets"
description: "Targets are hosts, networks, and services discovered or identified during red team engagements. They form the foundation of your attack surface mappin"
nav_order: 10
parent: "StrikeKit"
---

## Creating Targets

![Targets List](../images/Targets.png)
*Target management with service tracking and compromise status*

1. Navigate to **Intelligence → Targets**
2. Click **Create Target**
3. Fill in target details

### Target Types

#### Host
Individual system or device:
- **IP Address**: IPv4 or IPv6 address (e.g., `192.168.1.100`)
- **Hostname**: DNS name (e.g., `webserver01.example.com`)
- **OS**: Operating system (Windows, Linux, macOS, etc.)
- **Status**: Discovered, Compromised, In Progress

#### Network
Network range or subnet:
- **CIDR**: Network notation (e.g., `10.0.0.0/24`)
- **Description**: Purpose or location
- **Gateway**: Default gateway IP

#### Service
Running service on a host:
- **Parent Host**: Which target hosts this service
- **Port**: TCP/UDP port number
- **Protocol**: HTTP, HTTPS, SSH, SMB, etc.
- **Version**: Service version or banner
- **Status**: Open, Filtered, Closed

## Target Information

### Required Fields

**IP Address or Hostname**: Primary identifier
```
Examples:
- 192.168.1.100
- webserver.example.com
- 2001:db8::1
```

**Type**: Host, Network, or Service

### Optional Fields

**Operating System**:
- Windows Server 2019
- Ubuntu 22.04 LTS
- macOS Sonoma 14.2
- Unknown (if not yet identified)

**Description**: Notes about the target
```
Examples:
- "Primary web server for client portal"
- "Domain controller for CORP domain"
- "Development database server"
```

**Tags**: Categorize targets
```
Examples:
- critical
- domain-controller
- web-server
- database
- dev-environment
```

**Status**:
- **Discovered**: Found but not yet accessed
- **In Progress**: Currently working on compromise
- **Compromised**: Successfully gained access
- **Out of Scope**: Identified but outside engagement scope

## Auto-Population

Targets are automatically created from:

### Reconnaissance Module
- Network scanning results
- DNS enumeration
- Service discovery
- OSINT collection

### C2 Commands
- `ipconfig` / `ifconfig` output
- `nslookup` / `dig` results
- `net view` output
- `arp -a` scanning

### Manual Import
- Paste list of IPs or hostnames
- Import from CSV file
- Copy from reconnaissance tools

## Target Details View

Click on a target to view:

### Overview
- Basic information (IP, hostname, OS)
- Current status
- Discovery date
- Last updated

### Services
List of running services:
- Port and protocol
- Service version
- Banner information
- Known vulnerabilities

### Credentials
Associated credentials:
- Username/password pairs
- Hashes
- API keys
- SSH keys

### Findings
Related vulnerabilities:
- Findings affecting this target
- Severity breakdown
- Remediation status

### Activities
Related activities:
- Reconnaissance performed
- Exploitation attempts
- Post-exploitation activities
- Timestamps and details

### Notes
Target-specific notes:
- Technical observations
- Access paths
- Configuration details
- Special considerations

## Marking Targets as Compromised

When you gain access to a target:

1. Open target details
2. Change **Status** to **Compromised**
3. Document:
   - How access was gained
   - Credential used
   - Current privileges
   - Persistence mechanisms

Compromised targets appear with distinct visual indicators in:
- Target list
- Network Topology view
- Pivot Chain visualization

## Linking Targets

### To Credentials
Associate discovered credentials:
1. In target details, click **Add Credential**
2. Select credential from list or create new
3. Credential appears on target page
4. Target appears on credential page

### To Findings
Link vulnerabilities to affected targets:
1. When creating finding, select **Affected Targets**
2. Choose one or more targets
3. Finding appears in target's findings list
4. Remediation can be tracked per-target

### To Pivot Chains
Show lateral movement paths:
1. Create pivot chain in **Mission → Pivot Chains**
2. Add targets as nodes in the chain
3. Visualize compromise progression
4. Track how you moved through network

## Target Organization

### By Status
Filter targets by status:
- Show only compromised targets
- Show targets in progress
- Hide out-of-scope targets

### By Type
Filter by target type:
- Hosts only
- Networks only
- Services only

### By Tags
Use tags for organization:
- `critical` - High-value targets
- `domain-controller` - AD infrastructure
- `web-app` - Web applications
- `database` - Database servers
- `workstation` - User endpoints

### Search
Search by:
- IP address
- Hostname
- Description
- Tags
- Operating system

## Network Topology

Targets appear in **Analysis → Network Topology**:

### Map View
Visual representation showing:
- Target locations
- Connections between targets
- Compromise status (color-coded)
- Service information

### Pivot Visualization
Shows attack progression:
- Initial access point
- Lateral movement path
- Current position
- Compromised targets highlighted

## Best Practices

### Target Naming

Use consistent conventions:
```
Good:
- webserver01.corp.local
- 192.168.1.100 (Web Server)
- DC01 (Domain Controller)

Avoid:
- server
- 192.168.1.100
- target1
```

### Status Updates

Keep status current:
- Update to "In Progress" when actively working
- Update to "Compromised" immediately after access
- Document compromise method in notes

### Service Documentation

For each discovered service, record:
- Port number and protocol
- Service version
- Banner information
- Known vulnerabilities (link to CVEs)

### Credential Tracking

Link all credentials to targets:
- Where credential was found
- Which targets it works on
- Privilege level granted
- Whether credential provides unique access

### Out of Scope Handling

When discovering out-of-scope targets:
1. Mark as "Out of Scope" immediately
2. Document in notes
3. Do NOT attempt access
4. Create blocker if needs client clarification
5. Notify client if sensitive

## Import/Export

### Import Targets

Import from common formats:

**CSV Format:**
```csv
ip,hostname,os,type,description
192.168.1.100,web01.corp.local,Ubuntu 22.04,host,Primary web server
192.168.1.101,db01.corp.local,Windows Server 2019,host,SQL Server
10.0.0.0/24,,,network,Internal network
```

**Nmap XML:**
- Import nmap scan results
- Auto-creates hosts and services
- Includes OS detection and service versions

**Text List:**
```
192.168.1.100
192.168.1.101
10.0.0.0/24
webserver.example.com
```

### Export Targets

Export for:
- Backup and archival
- Sharing with team
- Integration with other tools
- Report generation

**Export formats:**
- CSV (spreadsheet compatibility)
- JSON (programmatic access)
- Markdown (documentation)

## Common Workflows

### Initial Reconnaissance

1. Run network scan from **Toolkit → Reconnaissance**
2. Review discovered targets in **Intelligence → Targets**
3. Add manual targets from OSINT
4. Tag by priority (critical, high-value, etc.)
5. Review and mark any out-of-scope targets

### Active Exploitation

1. Select target from list
2. Review services and known vulnerabilities
3. Attempt exploitation
4. If successful, mark as "Compromised"
5. Document access method in notes
6. Link credentials used
7. Create finding for vulnerability exploited

### Lateral Movement

1. From compromised target, enumerate internal network
2. Discover new targets via C2 commands
3. New targets auto-populate list
4. Prioritize based on objectives
5. Attempt lateral movement
6. Create pivot chain showing progression
7. Update network topology

### Pre-Report Review

1. Filter by "Compromised" status
2. Verify all have:
   - Clear description
   - Linked credentials
   - Related findings
   - Compromise method documented
3. Generate network topology diagram
4. Include in report's attack path section

## Tips

1. **Document immediately**: Add targets as you discover them
2. **Use descriptive names**: Make it easy to identify targets months later
3. **Tag consistently**: Use the same tag names across engagements
4. **Link credentials**: Always associate credentials with targets
5. **Update status**: Keep compromise status current for accurate reporting
6. **Service enumeration**: Document all discovered services, not just exploitable ones
7. **Out-of-scope caution**: Mark immediately to avoid accidental access
8. **Network grouping**: Use CIDR notation for network ranges
9. **Screenshots**: Capture evidence of compromise for findings
10. **Pivot tracking**: Document how you moved between targets

## Troubleshooting

### Duplicate Targets

If reconnaissance creates duplicates:
1. Review target list for duplicates (same IP, different hostname)
2. Merge information manually
3. Delete duplicate entries
4. Update any linked items (credentials, findings)

### Service Not Detected

If service isn't auto-populated:
1. Manually create service entry
2. Link to parent host
3. Add service details (port, protocol, version)
4. Check reconnaissance configuration

### Missing OS Information

To identify operating system:
- Run OS fingerprinting scan
- Check service banners for hints
- Use TTL values (64=Linux, 128=Windows)
- Manual inspection after compromise

## Related Features

- [Network Topology](network-topology) - Visualize targets and connections
- [Credentials](credentials) - Associate credentials with targets
- [Findings](findings) - Link vulnerabilities to targets
- [Pivot Chains](pivot-chains) - Track lateral movement
- [C2](c2) - Auto-populate from C2 commands
- [Reconnaissance](reconnaissance) - Auto-discover targets

---

## Next Steps

After adding targets:

1. **[Test Credentials](credentials)** - Verify credentials against targets
2. **[Document Findings](findings)** - Record vulnerabilities on targets
3. **[Collect Evidence](evidence)** - Gather proof from target systems
4. **[Track Lateral Movement](../user-guide/workflow#lateral-movement)** - Use targets for pivoting
5. **[Visualize Network](network-topology)** - See targets in network map

**Related Documentation:**
- [C2 Operations](c2) - Auto-populate targets from C2
- [Reconnaissance](../user-guide/workflow#reconnaissance) - Discover targets
- [Kill Chain](kill-chain) - Target progression through attack phases

## Video Tutorial

> 📹 **Coming Soon**: Target management and organization best practices

## Quick Demo

> 🎬 **GIF**: Adding a target manually
> 🎬 **GIF**: Marking target as compromised

