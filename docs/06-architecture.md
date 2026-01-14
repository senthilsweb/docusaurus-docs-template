---
id: architecture
title: Architecture
sidebar_position: 6
description: Technical architecture of the MalloyData Agentic AI semantic layer
keywords: [architecture, malloy, duckdb, mcp, semantic-layer, agentic-ai]
---

# Architecture

Technical architecture for the Malloy + DuckDB + MCP semantic layer.

## Overview

MalloyData Agentic AI is a **lightweight semantic layer** that enables natural language queries over Parquet files. It uses the same MCP (Model Context Protocol) interface as our enterprise Cube.dev stack, making it a drop-in alternative for learning and small projects.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MalloyData Agentic AI                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐    │
│   │ Chat Client  │────▶│ MCP REST Bridge  │────▶│ Malloy MCP Server    │    │
│   │ (Next.js)    │     │ (FastAPI)        │     │ (Node.js + DuckDB)   │    │
│   │ Port 3000    │     │ Port 8006        │     │ (embedded)           │    │
│   └──────────────┘     └──────────────────┘     └──────────┬───────────┘    │
│                                                             │                │
│                                                             ▼                │
│                                              ┌──────────────────────────┐   │
│                                              │    Parquet Files         │   │
│                                              │    + semantic.yaml       │   │
│                                              └──────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Semantic Layer Comparison

This project is part of a broader **Agentic AI Analytics** initiative. Here's how different semantic layer approaches compare:

| Aspect | Cube.dev | Mondrian | MalloyData (This Project) |
|--------|----------|----------|---------------------------|
| **Primary Use** | Production analytics | Enterprise OLAP | Learning, POCs |
| **Data Sources** | PostgreSQL, Snowflake, BigQuery | RDBMS | Parquet files |
| **Query Engine** | Cube.dev SQL | MDX | DuckDB (embedded) |
| **Schema Definition** | JavaScript models | XML Schema | YAML + semantic.yaml |
| **Caching** | Built-in cache layer | Aggregate tables | None (fast enough) |
| **Infrastructure** | Multi-container | Java server | Single Docker container |
| **Scalability** | High | High | Single-node |
| **MCP Interface** | ✅ Same 6 tools | Custom | ✅ Same 6 tools |

### When to Use Which

| Scenario | Recommended Stack |
|----------|-------------------|
| Production analytics with PostgreSQL | Cube.dev + MCP |
| Enterprise MDX/OLAP requirements | Mondrian |
| Learning semantic layer concepts | **MalloyData** |
| Quick POC with CSV/Parquet files | **MalloyData** |
| CI/CD demo environments | **MalloyData** |
| Single-file data analysis | **MalloyData** |

## Core Components

### 1. MCP REST Bridge (Python/FastAPI)

The **heart of the system** - translates HTTP requests into MCP protocol calls.

```
HTTP POST /query  →  MCP tool("query", {...})  →  JSON response
```

| Responsibility | Details |
|----------------|---------|
| REST API | Exposes `/query`, `/models`, `/health` endpoints |
| MCP Client | Spawns and communicates with MCP server via stdio |
| AI Chat | Streams OpenAI responses with tool calling |
| Protocol Bridge | Translates between REST ↔ MCP |

### 2. Malloy MCP Server (Node.js)

Implements the **MCP server protocol** with 6 tools:

| Tool | Purpose |
|------|---------|
| `list_models` | Discover available cubes from semantic.yaml |
| `describe_model` | Get dimensions, measures, time_dimensions |
| `get_schema` | Return full semantic schema |
| `query` | Execute Cube-compatible JSON query |
| `explain_query` | Show generated SQL |
| `nested_query` | Execute queries with nested dimensions |

### 3. DuckDB (Embedded)

**Zero-infrastructure analytics database** embedded in Node.js:

- Reads Parquet files directly
- SQL execution engine
- No external process or server
- ARM64-compatible via Docker `--platform=linux/amd64`

### 4. Semantic Configuration (YAML)

Unlike Cube.dev (JavaScript) or Mondrian (XML), we use **simple YAML**:

```yaml
cubes:
  - name: jira_issues
    source:
      type: parquet
      path: /app/data/jira_issues.parquet
    
    dimensions:
      - name: status
        type: string
        sql: status
        
    measures:
      - name: count
        type: count
        
    time_dimensions:
      - name: created
        type: time
        sql: created
        granularities: [year, quarter, month, week, day]
```

## Design Principles

### 1. Same Interface, Different Backend

The MCP tools interface is **identical** to our Cube.dev stack:

```javascript
// Works with Cube.dev stack
{ tool: "query", arguments: { measures: ["count"], dimensions: ["status"] } }

// Works with MalloyData stack (same call)
{ tool: "query", arguments: { measures: ["count"], dimensions: ["status"] } }
```

This means:
- Chat clients work with both stacks
- AI prompts don't need changes
- Easy migration between stacks

### 2. File-Based, Not Database-Dependent

```
Traditional Stack:
  CSV → Database → ETL → Semantic Layer → Query

MalloyData Stack:
  Parquet File → Semantic Layer → Query
```

Benefits:
- **Portable**: Copy files, copy analytics
- **Version control**: Check Parquet + YAML into git
- **Reproducible**: Same files = same results

### 3. LLM-Driven Discovery

The AI agent discovers schema dynamically:

```
1. User: "Show issues by status"
2. LLM: list_models() → ["jira_issues"]
3. LLM: describe_model("jira_issues") → {dimensions: [...], measures: [...]}
4. LLM: query({measures: ["jira_issues.count"], dimensions: ["jira_issues.status"]})
5. LLM: Formats and presents results
```

No hardcoded domain logic - the LLM composes queries from schema metadata.

## Query Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Message                                                  │
│    "Show me JIRA issues by status"                               │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. OpenAI Tool Selection                                         │
│    → Calls list_models() to discover available data              │
│    → Calls describe_model("jira_issues") for schema              │
│    → Constructs query JSON                                       │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. MCP REST Bridge                                               │
│    POST /query → MCP tool call → Malloy MCP Server               │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Malloy MCP Server                                             │
│    → Parses semantic.yaml                                        │
│    → Translates to DuckDB SQL                                    │
│    → Executes against Parquet file                               │
└──────────────────────────────┬──────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Response                                                      │
│    { data: [{status: "Open", count: 150}, ...] }                 │
└─────────────────────────────────────────────────────────────────┘
```

## Docker Architecture

Single `docker-compose.yml` with minimal services:

```yaml
services:
  mcp-rest-bridge:    # FastAPI + Malloy MCP Server
    ports: ["8006:8006"]
    volumes:
      - ./data:/app/data        # Parquet files
      - ./models:/app/models    # semantic.yaml
    
  playground:          # Interactive query builder
    ports: ["8080:80"]
```

Compared to Cube.dev stack (4+ containers), MalloyData runs in **1-2 containers**.

## Data Pipeline (Optional)

For production use, you might have a simple pipeline:

```
Source Data    →    Parquet Export    →    MalloyData Analytics
───────────────────────────────────────────────────────────────
DuckDB query        export_parquet()       query via MCP
CSV files           pandas.to_parquet()
API response        polars.write_parquet()
```

No DBT, no complex ETL - just export to Parquet and define `semantic.yaml`.

## Next Steps

- [API Reference](02-api-reference.md) - Full REST API and MCP tools
- [Query Flow](03-query-flow.md) - Detailed query processing
- [Deployment](04-deployment.md) - Advanced Docker configuration
