---
title: "Credentials"
description: "Credentials are usernames, passwords, hashes, tokens, and keys discovered during red team engagements. Proper credential management is essential for l"
nav_order: 11
parent: "StrikeKit"
---

![Credentials Manager](../images/Credentials.png)
*Credentials management interface showing discovered credentials*

## Creating Credentials

1. Navigate to **Analysis → Credentials**
2. Click **Create Credential**
3. Fill in credential details

## Credential Types

### Username/Password
Standard authentication credentials:
- **Username**: Account name
- **Password**: Plaintext password
- **Domain**: AD domain or local system

**Example:**
```
Username: administrator
Password: P@ssw0rd123
Domain: CORP
```

### Password Hash
Encrypted or hashed passwords:
- **Username**: Account name
- **Hash**: Hash value
- **Hash Type**: NTLM, SHA256, bcrypt, etc.

**Example:**
```
Username: admin
Hash: 5f4dcc3b5aa765d61d8327deb882cf99
Type: MD5
```

### API Token
API keys and bearer tokens:
- **Service**: API service name
- **Token**: Token value
- **Scope**: Permissions or access level

**Example:**
```
Service: AWS
Token: AKIAIOSFODNN7EXAMPLE
Scope: s3:ReadOnly
```

### SSH Key
SSH private keys:
- **Username**: SSH user
- **Key**: Private key content
- **Passphrase**: Key passphrase (if encrypted)

**Example:**
```
Username: root
Key: -----BEGIN RSA PRIVATE KEY-----
     [key content]
     -----END RSA PRIVATE KEY-----
Passphrase: [if applicable]
```

### Certificate
Digital certificates:
- **Subject**: Certificate subject
- **Thumbprint**: Certificate identifier
- **PFX/PEM**: Certificate file content

## Credential Fields

### Required Fields

**Type**: Username/Password, Hash, Token, SSH Key, Certificate

**Value**: The actual credential (password, hash, token, key)

### Important Fields

**Username**: Account name or identifier

**Domain**: Windows domain, LDAP directory, or system name

**Source**: Where credential was discovered
- Configuration file
- Memory dump
- Network traffic
- Database
- User input
- Password manager
- Web browser

**Target**: Which target this credential works on

**Privilege Level**:
- User
- Administrator
- System/Root
- Domain Admin
- Enterprise Admin

**Status**:
- Untested
- Valid
- Invalid
- Expired
- Changed

### Optional Fields

**Description**: Notes about the credential
```
Examples:
- "Found in web.config file"
- "Extracted from LSASS memory"
- "Discovered in database backup"
```

**Notes**: Additional information
- Password complexity
- Last tested date
- Usage restrictions
- Related credentials

**Tags**: Organize credentials
```
Examples:
- critical
- domain-admin
- service-account
- local-admin
- api-key
```

## Auto-Extraction

Credentials are automatically extracted from:

### C2 Command Output
- `net user` output
- `/etc/shadow` dumps
- Mimikatz output
- LaZagne results
- Browser password dumps

### Configuration Files
- `web.config` files
- `.env` files
- Database connection strings
- Application config files

### Manual Import
- Paste credential lists
- Import from CSV
- Import from password managers

## Credential Testing

### Test Credentials

Verify credential validity:

1. Select credential from list
2. Click **Test Credential**
3. Choose target to test against
4. View test results
5. Status updates automatically

### Testing Methods

**SMB/RPC**: Windows network authentication
```
Test against: Domain controllers, file servers
Validates: Domain credentials
```

**SSH**: Unix/Linux remote access
```
Test against: Linux hosts
Validates: SSH credentials
```

**RDP**: Windows remote desktop
```
Test against: Windows workstations/servers
Validates: Local or domain credentials
```

**Database**: Database authentication
```
Test against: SQL Server, MySQL, PostgreSQL
Validates: Database credentials
```

**API**: API authentication
```
Test against: REST APIs
Validates: API tokens
```

## Linking Credentials

### To Targets

Associate credentials with targets:

1. In credential details, select **Add Target**
2. Choose target(s) where credential works
3. Specify privilege level on each target
4. Credential appears in target's credential list

**Benefits:**
- Track which credentials work where
- Identify reused passwords
- Plan lateral movement
- Generate credential maps

### To Findings

Link to related vulnerabilities:

1. When documenting finding, reference credential
2. Show how credential was obtained
3. Demonstrate impact of credential exposure
4. Link to remediation recommendations

## Credential Reuse

### Identifying Reuse

StrikeKit helps identify credential reuse:

**Same Password, Multiple Accounts:**
- Highlights accounts using identical passwords
- Shows scope of password reuse
- Prioritizes for security findings

**Working on Multiple Targets:**
- Tracks which targets accept the same credential
- Visualizes lateral movement opportunities
- Shows blast radius of compromise

### Exploiting Reuse

When credential reuse is identified:

1. Document as finding (weak security practice)
2. Test credential on other discovered targets
3. Track successful lateral movement
4. Update pivot chains
5. Document in kill chain progression

## Credential Organization

### By Type
Filter by credential type:
- Passwords only
- Hashes only
- API tokens
- SSH keys

### By Status
Filter by validation status:
- Valid (confirmed working)
- Untested (not yet verified)
- Invalid (confirmed not working)
- Expired (no longer valid)

### By Privilege
Filter by privilege level:
- Administrator/Root
- Domain Admin
- User-level
- Service accounts

### By Target
View credentials by associated target:
- Show all credentials for specific host
- Group by domain/system
- Filter by network segment

### Search
Search by:
- Username
- Domain
- Source
- Description
- Tags

## Security Practices

### Storage Security

StrikeKit stores credentials securely:
- Database encryption at rest
- No plaintext in logs
- Masked display by default
- Access logging

### Handling Guidelines

1. **Minimize exposure**: Only access credentials when needed
2. **Don't reuse**: Never use discovered credentials for non-authorized purposes
3. **Secure transmission**: Use encrypted channels when sharing
4. **Document carefully**: Note where found and how obtained
5. **Responsible disclosure**: Include in findings with remediation

### Legal Considerations

- Only use within scope of engagement
- Follow client's data handling requirements
- Secure storage after engagement
- Proper disposal per agreement
- Include in final report

## Reporting

### Credential Findings

Document credential-related vulnerabilities:

**Weak Passwords:**
- Common/default passwords
- Dictionary words
- Keyboard patterns
- Company name variations

**Credential Exposure:**
- Plaintext in configuration files
- Hardcoded in source code
- Stored in browser
- Transmitted unencrypted

**Credential Reuse:**
- Same password across accounts
- Shared service accounts
- Personal passwords on corporate systems

**Insufficient Protection:**
- Weak hashing algorithms
- No password complexity requirements
- No account lockout policy
- Password never expires

### Evidence Collection

For each credential finding, include:
- Screenshot showing where found
- Command output or file content
- Demonstration of validity
- Scope of access granted
- Reuse analysis

## Best Practices

### Documentation

Record complete information:
```
Good:
Username: sqlsvc
Password: P@ssw0rd123
Domain: CORP
Source: Found in web.config on webserver01
Privilege: db_owner on SQLPROD
Tested: Valid on 2026-01-15
Notes: Service account for web app database connection

Avoid:
Username: admin
Password: password
```

### Testing

Test systematically:
1. Test credential against original source
2. Test against similar targets
3. Test for lateral movement
4. Test for privilege escalation
5. Document all test results

### Prioritization

Focus on high-value credentials:
1. **Domain Admin**: Full domain control
2. **Enterprise Admin**: Forest-wide access
3. **Local Admin on multiple hosts**: Lateral movement
4. **Service accounts**: Often over-privileged
5. **API keys with broad scope**: Data access

### Credential Mapping

Create visual maps showing:
- Which credentials work on which targets
- Privilege levels per target
- Lateral movement paths
- Privilege escalation paths

## Common Workflows

### Initial Discovery

1. Discover credential via reconnaissance or exploitation
2. Create credential entry immediately
3. Mark as "Untested"
4. Document source clearly
5. Add relevant tags

### Credential Testing

1. Select untested credential
2. Test against original target
3. Update status based on results
4. If valid, test against other targets
5. Document all test results
6. Create findings for vulnerabilities

### Lateral Movement

1. Review valid credentials
2. Identify potential targets
3. Test credentials against targets
4. Document successful access
5. Mark targets as compromised
6. Create pivot chain entries
7. Update kill chain

### Report Preparation

1. Filter by "Valid" status
2. Review all discovered credentials
3. Group by type and privilege level
4. Create findings for:
   - Weak passwords
   - Credential exposure
   - Credential reuse
   - Insufficient protection
5. Include credential statistics in report

## Tips

1. **Document immediately**: Record credentials as you find them
2. **Test systematically**: Don't assume credentials work everywhere
3. **Track privilege**: Note what access each credential provides
4. **Look for patterns**: Password patterns reveal policy weaknesses
5. **Check reuse**: Always test credentials on other targets
6. **Protect carefully**: Handle credentials securely
7. **Link everything**: Connect credentials to targets, findings, and sources
8. **Note expiration**: Track if credentials expire or change
9. **Service accounts**: Often most valuable for persistence
10. **Hash formats**: Correctly identify hash types for cracking attempts

## Troubleshooting

### Credential Not Working

If credential tests invalid:
1. Verify correct format (domain\username vs username@domain)
2. Check for special characters in password
3. Verify privilege level
4. Check account status (locked, disabled, expired)
5. Test against different services
6. Consider account lockout policy

### Hash Cracking

For password hashes:
1. Identify hash type correctly
2. Use appropriate cracking tool (hashcat, john)
3. Apply appropriate wordlists
4. Consider rules and mutations
5. Document cracked passwords

### API Token Issues

For invalid API tokens:
1. Check token format
2. Verify token scope
3. Check expiration
4. Test correct API endpoint
5. Review authentication method

## Related Features

- [Targets](targets) - Link credentials to targets
- [Findings](findings) - Document credential-related vulnerabilities
- [Pivot Chains](pivot-chains) - Use credentials for lateral movement
- [C2](c2) - Auto-extract from C2 output
- [Evidence](evidence) - Store credential discovery proof

---

## Next Steps

After collecting credentials:

1. **[Test Against Targets](targets)** - Verify where credentials work
2. **[Track Lateral Movement](../user-guide/workflow#lateral-movement)** - Use for pivoting
3. **[Document Findings](findings)** - Record credential-related vulnerabilities
4. **[Create Evidence](evidence)** - Screenshot credential discovery
5. **[Generate Reports](reports)** - Include credential analysis in deliverables

**Related Documentation:**
- [C2 Operations](c2) - Auto-extract from C2 output
- [Targets](targets) - Link credentials to systems
- [Findings](findings) - Document credential exposure

## Video Tutorial

> 📹 **Coming Soon**: Complete credential management workflow

## Quick Demos

> 🎬 **GIF**: Adding credentials manually
> 🎬 **GIF**: Testing credentials against targets
> 🎬 **GIF**: Identifying credential reuse

