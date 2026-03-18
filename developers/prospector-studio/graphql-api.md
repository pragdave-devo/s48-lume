---
title: GraphQL API
description: Prospector Studio GraphQL API reference for integrators.
nav_order: 1
parent: "For Developers"
---

Prospector Studio exposes a GraphQL API for all client-server communication. Connector developers and integration builders can use this API to interact with the platform programmatically.

## Endpoint

- **HTTP**: `POST /api/graphql`
- **WebSocket**: `/api/graphql/websocket` (subscriptions)

## Authentication

All requests require a valid OIDC token. The token is validated against Keycloak and scoped to a tenant and user.

```bash
curl -X POST https://studio.example.com/api/graphql \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"query": "{ listMcpServers { id name } }"}'
```

## Schema

The GraphQL schema covers:

- **Conversations** — Create, list, and manage chat conversations
- **Messages** — Send messages and receive streamed responses
- **Agents** — CRUD operations for agent configuration
- **Knowledge Bases** — Manage knowledge bases and documents
- **Workflows** — Define, execute, and monitor workflows
- **MCP Servers** — List servers and query available tools
- **Connectors** — Query connector apps and capabilities
- **Feature Flags** — Query enabled features

## Subscriptions

Real-time updates are delivered via GraphQL subscriptions over WebSocket:

- **Message streaming** — Token-by-token LLM responses
- **Document processing** — Status updates as documents are indexed
- **Workflow execution** — Task status changes during workflow runs
