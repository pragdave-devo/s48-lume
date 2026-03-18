---
title: "Execution"
description: "Engagement kickoff and step-by-step operation monitoring with approval gates for risky actions."
nav_order: 8
parent: "StrikeKit"
---

## Overview

The Execution view provides real-time monitoring of engagement operations with built-in safety controls for risky activities.

![Execution Monitor](../images/Execution.png)
*Real-time operation monitoring with approval gates*

## Features

### Operation Monitoring
Track active operations:
- Current phase
- Operations in progress
- Completion status
- Error tracking

### Approval Gates
Require approval before:
- Out-of-scope actions
- Privilege escalation
- Data exfiltration
- Service disruption
- Credential use

### Real-Time Status
Live updates showing:
- Active operations
- Pending approvals
- Blocked operations
- Completed tasks

### Notification System
Alerts for:
- Operations requiring approval
- Completed operations
- Failed operations
- Blockers encountered

## Approval Gates

### Configuring Gates

Define what requires approval:
1. Navigate to **Mission → Execution**
2. Configure gate settings
3. Define notification recipients
4. Set timeout policies

### Handling Approvals

When operation requires approval:
1. Operation pauses
2. Notification sent
3. Reviewer approves/denies
4. Operation continues or stops

### Gate Types

**Scope Gates:**
- Out-of-scope target access
- New network discovery
- Unplanned system interaction

**Risk Gates:**
- Service disruption risk
- Data modification
- Account creation
- Persistence mechanisms

**Compliance Gates:**
- Credential usage
- Data exfiltration
- Privilege escalation
- System modifications

## Engagement Kickoff

### Starting Operations

1. Complete planning
2. Review objectives
3. Check approval gates configured
4. Start execution monitoring
5. Begin operations

### Operation Tracking

Monitor through execution view:
- Operation type
- Target system
- Status (Running/Paused/Complete)
- Evidence collected
- Issues encountered

## Best Practices

1. **Configure gates early**: Set up before operations begin
2. **Clear approval process**: Define who approves what
3. **Monitor regularly**: Check execution view frequently
4. **Document approvals**: Record all approval decisions
5. **Emergency stop**: Know how to pause all operations

## Related Features

- [Planning](planning) - Define execution plan
- [Objectives](objectives) - Track goal achievement
- [Blockers](../user-guide/interface-overview#blockers) - Handle obstacles
- [Timeline](timeline) - Review operation history

