---
title: Agents
description: Create and manage AI agents in Prospector Studio.
nav_order: 4
parent: "Prospector Studio"
---

Agents are the core building block of Prospector Studio. Each agent combines an LLM with custom tools, skills, and knowledge bases to perform tasks autonomously.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/agents.mp4" type="video/mp4" />
</video>

## Creating an Agent

From the Studio UI, navigate to the Agents section and create a new agent. Configure:

- **Name** — A descriptive name for the agent
- **Model** — The LLM provider and model (e.g., Claude)
- **System Prompt** — Instructions that define the agent's behavior
- **Tools** — External integrations the agent can invoke
- **Knowledge Bases** — Document collections the agent can query for context

## Agent Capabilities

### Tools
Agents can execute tools to interact with external systems. Tools are defined as actions the agent can invoke during a conversation, such as querying a database, calling an API, or triggering a workflow.

### Knowledge Base Integration
Attach one or more knowledge bases to an agent to give it access to your organization's documents. When a user asks a question, the agent performs a semantic search against the knowledge base and includes relevant context in its response.

### Conversations
Each conversation with an agent maintains full context history. Agents can handle multi-turn interactions, reference previous messages, and maintain state across a session.

## LLM Providers

Prospector Studio supports multiple LLM providers through a unified API:
- **Anthropic** — Claude models via AWS Bedrock

Additional providers may be supported in the future. The provider and model are configured per-agent, allowing different agents to use different models based on their use case.
