---
title: Knowledge Bases
description: Upload documents and enable RAG in Prospector Studio.
nav_order: 5
parent: "Prospector Studio"
---

Knowledge Bases provide Retrieval-Augmented Generation (RAG) capabilities to Prospector Studio agents. Upload documents, and the platform automatically processes them for semantic search.

<video autoplay loop muted playsinline style="width:100%; margin-top:0.75rem; border-radius:0.75rem; box-shadow:0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.10);">
  <source src="/assets/img/prospector-studio/videos/knowledge-bases.mp4" type="video/mp4" />
</video>

## Creating a Knowledge Base

1. Navigate to the Knowledge Bases section in Studio
2. Create a new knowledge base with a name and description
3. Upload documents to the knowledge base
4. Wait for processing to complete — documents are automatically chunked, embedded, and indexed

## Supported Formats

Prospector Studio supports a wide range of document formats:

| Format | Extensions |
|--------|-----------|
| PDF | `.pdf` |
| Word | `.docx` |
| PowerPoint | `.pptx` |
| Excel | `.xlsx` |
| OpenDocument | `.odt`, `.odp`, `.ods` |
| CSV | `.csv` |
| JSON | `.json` |
| XML | `.xml` |
| HTML | `.html` |
| Plain text | `.txt`, `.md` |

## How It Works

When you upload a document, Prospector Studio:

1. **Parses** the document using format-specific extractors
2. **Chunks** the content into semantically meaningful segments
3. **Generates embeddings** via LiteLLM for each chunk
4. **Indexes** the vectors in PostgreSQL using pgvector

When an agent with an attached knowledge base receives a query, it:

1. Generates an embedding for the user's question
2. Performs a vector similarity search against the knowledge base
3. Includes the most relevant chunks as context in the LLM prompt

## Attaching to Agents

Knowledge bases are connected to agents through the agent configuration. A single agent can reference multiple knowledge bases, and a single knowledge base can be shared across multiple agents.

## Document Processing Status

Documents go through a processing pipeline after upload. You can monitor the status of each document in real-time through the Studio UI. States include:
- **Pending** — Queued for processing
- **Processing** — Being parsed, chunked, and embedded
- **Ready** — Fully indexed and available for search
- **Failed** — An error occurred during processing
