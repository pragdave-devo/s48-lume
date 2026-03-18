---
title: Workflows
description: Build and run automated workflows in Prospector Studio.
nav_order: 6
parent: "Prospector Studio"
---

Workflows in Prospector Studio let you compose multi-step automated processes with conditional logic, approval gates, and artifact passing between steps.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/workflows.mp4" type="video/mp4" />
</video>

## Creating a Workflow

From the Studio UI, navigate to the Workflows section to create and manage workflows. Each workflow is defined as a directed graph of tasks.

## Task Types

Workflows support several task types:

| Task Type | Description |
|-----------|-------------|
| **Container** | Run a Docker container with custom commands |
| **Python** | Execute Python scripts |
| **SQL** | Run database queries |
| **LLM** | Invoke an LLM with a prompt and context |
| **Branch** | Conditional routing based on output |
| **Gate** | Require human approval before proceeding |
| **Array** | Iterate over a collection |

## Workflow Features

### Conditional Branching
Route execution based on task outputs. Branch tasks evaluate conditions and direct the workflow down different paths.

### Approval Gates
Insert human-in-the-loop checkpoints. Gate tasks pause execution until an authorized user approves or rejects the step.

### Artifacts
Tasks can produce artifacts (files, data) that downstream tasks consume. Artifacts are managed automatically and available throughout the workflow execution.

### Real-Time Monitoring
Monitor workflow executions in real-time through the Studio UI. Each task shows its status, output, and timing information as the workflow runs.

## Execution

Workflows can be triggered:
- **Manually** from the Studio UI
- **By an agent** during a conversation
- **Via API** through the GraphQL endpoint
