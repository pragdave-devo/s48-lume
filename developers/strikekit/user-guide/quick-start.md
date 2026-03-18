---
title: "Quick Start Guide"
description: "Get up and running with StrikeKit in 15 minutes."
nav_order: 3
parent: "StrikeKit"
---

## Prerequisites

- Access to Strike48 Studio
- Valid Strike48 credentials

## Step 1: Access StrikeKit (2 minutes)

StrikeKit is accessed through Strike48 Studio:

1. Navigate to your Strike48 Studio instance
2. Select the StrikeKit application
3. Log in with your Strike48 credentials
4. StrikeKit interface loads in your browser

> **Note**: StrikeKit runs as part of the Strike48 platform, not as a standalone application.

## Step 2: Create Your First Engagement (3 minutes)

1. Click **Headquarters → Engagements** in the sidebar
2. Click **Create Engagement**
3. Fill in basic information:
   - **Name**: "Test Engagement"
   - **Client**: Your organization
   - **Type**: Select engagement type
   - **Dates**: Set start and end dates
4. Add **Scope**:
   ```
   Example: 192.168.1.0/24, test.example.com
   ```
5. Add **Rules of Engagement**:
   ```
   Example: Testing hours: 9am-5pm weekdays
   No production database access
   ```
6. Click **Save**
7. **Select the engagement** from the dropdown at the top of the sidebar

## Step 3: Set an Objective (2 minutes)

1. Click **Mission → Objectives**
2. Click **Create Objective**
3. Set objective:
   - **Title**: "Gain administrative access"
   - **Priority**: High
   - **Description**: "Demonstrate ability to escalate privileges"
4. Click **Save**

## Step 4: Add a Target (2 minutes)

1. Click **Intelligence → Targets**
2. Click **Create Target**
3. Add target details:
   - **IP Address**: `192.168.1.100`
   - **Hostname**: `webserver01` (optional)
   - **Type**: Host
   - **OS**: Windows/Linux (if known)
4. Click **Save**

## Step 5: Document a Finding (3 minutes)

1. Click **Analysis → Findings**
2. Click **Create Finding**
3. Document vulnerability:
   - **Title**: "Weak Administrator Password"
   - **Severity**: High
   - **Description**: "Administrator account uses weak password"
   - **Impact**: "Allows unauthorized administrative access"
   - **Remediation**: "Implement strong password policy"
4. Link to **Target** (select from dropdown)
5. Click **Save**

## Step 6: Upload Evidence (2 minutes)

1. Click **Analysis → Evidence**
2. Click **Upload Evidence**
3. Select file or screenshot
4. Add description: "Screenshot showing successful admin login"
5. Link to **Finding** (select from dropdown)
6. Click **Save**

## Step 7: View Your Progress (1 minute)

1. Click **Headquarters → Dashboard**
   - See engagement overview
   - View finding statistics
   - Check recent activity

2. Click **Tracking → Kill Chain**
   - View attack phase progression
   - See activity distribution

3. Click **Tracking → Timeline**
   - Review chronological events
   - See engagement history

## What's Next?

Now that you've seen the basics, explore these features:

### Essential Features
- **[Credentials](../features/credentials)** - Store discovered credentials
- **[C2](../features/c2)** - Set up command and control
- **[Checklists](../features/checklists)** - Follow methodology steps
- **[Reports](../features/reports)** - Generate deliverables

### Advanced Features
- **[Planning](../features/planning)** - AI-assisted engagement planning
- **[Execution](../features/execution)** - Operation monitoring with approval gates
- **[MITRE ATT&CK](../features/mitre-attack)** - Technique mapping
- **[Network Topology](../features/network-topology)** - Infrastructure visualization

### Complete Guides
- **[Interface Overview](interface-overview)** - Detailed UI walkthrough
- **[Workflow](workflow)** - Complete engagement workflow
- **[Feature Documentation](../)** - All feature guides

## Video Tutorials

> 📹 **Coming Soon**: Complete walkthrough video showing all steps above

> 📹 **Coming Soon**: Scenario-based tutorials for different engagement types

## GIF Demonstrations

> 🎬 **Coming Soon**: Quick GIFs showing common tasks

## Common Questions

**Q: Can I use StrikeKit offline?**
A: No, StrikeKit requires connection to Strike48 Studio.

**Q: Where is my data stored?**
A: Locally in SQLite database on your system.

**Q: Can multiple users access the same engagement?**
A: Yes, through Strike48 Studio collaboration features.

**Q: How do I get help?**
A: Use the **Assistant** (Headquarters → Assistant) or see [complete documentation](../).

## Troubleshooting

**Can't access StrikeKit**: Verify Strike48 Studio URL and credentials

**Engagement views disabled**: Select an engagement from the dropdown

**Features not appearing**: Refresh browser or check engagement is active

**Data not saving**: Check browser console for errors

## Next Steps

- [ ] Complete your first full engagement using the [Workflow Guide](workflow)
- [ ] Explore all features in the [Interface Overview](interface-overview)
- [ ] Read feature-specific guides for detailed instructions
- [ ] Set up C2 infrastructure for active operations

## Need Help?

- **In-app**: Use **Headquarters → Assistant** for context-aware help
- **Documentation**: Browse [complete feature guides](../)
- **Support**: Contact Strike48 support team

