---
title: MCP Servers
description: Extend agent capabilities with Model Context Protocol servers.
nav_order: 7
parent: "Prospector Studio"
---

MCP (Model Context Protocol) servers let you connect external tools, resources, and prompts to Prospector Studio agents over a standardized HTTP protocol.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/mcp-servers.mp4" type="video/mp4" />
</video>

## What Are MCP Servers?

MCP is an open protocol that allows AI applications to interact with external services. Each MCP server can expose:

- **Tools** — Executable functions (e.g., search the web, read a file, run a query)
- **Resources** — Data access endpoints (e.g., configuration, database records)
- **Prompts** — Pre-defined prompt templates with arguments

When an MCP server is connected to Prospector Studio, its tools become available to agents during conversations.

## Browsing and Configuring

From the Studio UI you can:

1. Browse the catalog of available MCP servers
2. Configure server connections (endpoint URL, credentials)
3. View the tools each server exposes
4. Attach MCP server tools to specific agents

## Built-In MCP Servers

Prospector Studio ships with several pre-configured MCP server integrations:

| Server | Description |
|--------|-------------|
| **Prospector Workflows** | Expose workflows as callable MCP tools |
| **GitHub MCP** | GitHub repository and issue operations |
| **Tavily MCP** | Web search and research |

## How It Works

```
User message → Agent → Tool Registry
                           ↓
                   MCP Tool selected
                           ↓
              HTTP POST (JSON-RPC) → MCP Server
                           ↓
                   Tool result returned
                           ↓
                Agent incorporates result
```

1. A user sends a message to an agent
2. The agent decides which tool to call based on the conversation
3. Prospector Studio sends a JSON-RPC request to the MCP server's HTTP endpoint
4. The server executes the tool and returns results
5. The agent uses the results to formulate its response

## Configuration

MCP servers can be configured at the system level via `.mcp.json`:

```json
{
  "mcpServers": {
    "matrix-workflows": {
      "type": "http",
      "url": "https://studio.example.com/workflows/mcp"
    }
  }
}
```

Servers can also be registered through the Studio UI or GraphQL API for runtime configuration.

## MCP vs Connectors

MCP servers and [Connectors](/prospector-studio/guides/connectors/) both extend agent capabilities, but serve different use cases:

| | MCP Servers | Connectors |
|---|---|---|
| **Protocol** | HTTP (JSON-RPC) | gRPC (bidirectional streaming) |
| **Connection** | Stateless request-response | Stateful persistent stream |
| **Best for** | Third-party integrations | Custom internal services |
| **Capabilities** | Tools, resources, prompts | Tools, data sources/sinks, pub/sub, web apps |
