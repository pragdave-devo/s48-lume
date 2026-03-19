---
title: Prospector Studio
description: AI-powered workflow automation and agent platform.
nav_order: 3
---

Prospector Studio is Strike48's AI-powered platform for building and managing autonomous agents, workflows, and knowledge bases. It serves as the backend orchestration layer that all Strike48 connector apps integrate with.

![Prospector Studio](/assets/img/prospector-studio/screenshots/overview.png)

## What is Prospector Studio?

Prospector Studio provides a web-based interface for:

- **Conversational AI** — Chat with configurable agents backed by LLM providers (Claude and more)
- **Agent Management** — Create agents with custom tools, integrations, and knowledge bases
- **Workflow Automation** — Build multi-step workflows with conditional routing, approval gates, and artifact management
- **Knowledge Bases** — Upload documents and enable RAG (Retrieval-Augmented Generation) for context-aware responses
- **Feature Flags** — Control feature rollouts at runtime

## Key Features

### Chat Interface
Interactive conversations with AI agents. Each conversation maintains full context and can leverage tools, knowledge bases, and workflow triggers.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/chat-interface.mp4" type="video/mp4" />
</video>

### Agents
Autonomous agents that combine LLM capabilities with custom tools and skills. Agents can execute actions, query knowledge bases, and trigger workflows on behalf of users.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/agents.mp4" type="video/mp4" />
</video>

### Knowledge Bases
Document-backed RAG powered by pgvector. Upload PDFs, DOCX, CSV, JSON, and other formats — Prospector Studio automatically chunks, embeds, and indexes content for semantic search.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/knowledge-bases.mp4" type="video/mp4" />
</video>

### Workflows
Visual workflow builder with support for:
- Container, Python, SQL, and LLM task types
- Conditional branching and approval gates
- Artifact management between steps
- Real-time execution monitoring

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/workflows.mp4" type="video/mp4" />
</video>

### MCP Servers
Connect external tools, resources, and prompts to agents via the Model Context Protocol. Browse available servers, configure connections, and attach tools to specific agents.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/mcp-servers.mp4" type="video/mp4" />
</video>

### Connectors
External services that integrate with Prospector Studio over a persistent gRPC bidirectional stream. Connectors provide tools, data pipelines, and even full web UIs to the platform.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/connectors.mp4" type="video/mp4" />
</video>

## Next Steps

- [Getting Started](/prospector-studio/getting-started/) — Set up and access Prospector Studio
- [Agents](/prospector-studio/guides/agents/) — Create and configure AI agents
- [Knowledge Bases](/prospector-studio/guides/knowledge-bases/) — Upload documents for RAG
- [Workflows](/prospector-studio/guides/workflows/) — Build automated workflows
- [MCP Servers](/prospector-studio/guides/mcp-servers/) — Connect external tools via Model Context Protocol
- [Connectors](/prospector-studio/guides/connectors/) — Integrate services over gRPC
