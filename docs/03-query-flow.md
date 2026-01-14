---
id: query-flow
title: Query Flow
sidebar_position: 3
description: How queries flow through the MalloyData Agentic AI system
keywords: [query, flow, architecture, malloy, duckdb]
---

# Query Flow Documentation

## Overview

This document explains how queries flow through the MalloyData Agentic AI system,
from user interface to data and back.

## Architecture Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            USER INTERFACES                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌────────────────────────┐      ┌────────────────────────────────────────────┐ │
│  │    CHAT CLIENT         │      │          PLAYGROUND                        │ │
│  │    (Natural Language)  │      │    (Visual Query Builder)                  │ │
│  │                        │      │                                            │ │
│  │  "How many private     │      │  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │ │
│  │   airports in CA?"     │      │  │Measures │ │Hierarchy│ │   Run Query  │  │ │
│  │                        │      │  │☑ count  │ │1.own_type│ │              │  │ │
│  │  → OpenAI translates   │      │  │         │ │2.state  │ │  Builds JSON │  │ │
│  │    to structured query │      │  └─────────┘ └─────────┘ └──────────────┘  │ │
│  └───────────┬────────────┘      └─────────────────────┬──────────────────────┘ │
│              │                                         │                        │
│              ▼                                         ▼                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                     QUERY FORMAT (Cube.dev Compatible)                  │    │
│  │                                                                         │    │
│  │  {                                                                      │    │
│  │    "measures": ["airports.count"],                                      │    │
│  │    "dimensions": ["airports.state", "airports.own_type"],  // flat      │    │
│  │    "hierarchy": ["airports.own_type", "airports.state"],   // nested    │    │
│  │    "filters": [                                                         │    │
│  │      {"member": "airports.state", "operator": "equals", "values": ["CA"]} │  │
│  │    ],                                                                   │    │
│  │    "limit": 100                                                         │    │
│  │  }                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MCP REST BRIDGE (FastAPI)                              │
│                              http://localhost:8006                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ENDPOINTS:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ POST /chat/stream    ← Natural language (SSE streaming response)       │    │
│  │ POST /query          ← Flat query (JSON response)                       │    │
│  │ POST /nested-query   ← Hierarchical query (nested JSON response)        │    │
│  │ POST /explain        ← Get SQL without executing                        │    │
│  │ GET  /models         ← List available models                            │    │
│  │ GET  /models/{name}  ← Get model schema                                 │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  CHAT FLOW:                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Receive user message                                                 │    │
│  │ 2. Send to OpenAI with SYSTEM_PROMPT + conversation history            │    │
│  │ 3. OpenAI returns tool calls (list_models, query, etc.)                │    │
│  │ 4. Execute each tool via MCP server (stdio)                            │    │
│  │ 5. Return tool results to OpenAI                                       │    │
│  │ 6. Stream final response back to client (SSE)                          │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                        stdio (JSON-RPC 2.0 over stdin/stdout)
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            MCP SERVER (Node.js)                                  │
│                           mcp-server/index.js                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  MCP TOOLS (6 total):                                                          │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ list_models     - Returns list of available semantic models            │    │
│  │ describe_model  - Returns measures, dimensions for a model             │    │
│  │ get_schema      - Returns full schema (all models)                      │    │
│  │ query           - Executes flat analytical query                        │    │
│  │ nested_query    - Executes Malloy-style hierarchical query              │    │
│  │ explain_query   - Returns generated SQL without executing               │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  QUERY PROCESSING:                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ 1. Receive Cube.dev-style query JSON                                   │    │
│  │ 2. Parse measures, dimensions, filters, hierarchy                      │    │
│  │ 3. Translate to SQL (with nested subqueries for hierarchy)             │    │
│  │ 4. Execute against DuckDB                                              │    │
│  │ 5. Return results with annotation metadata                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DUCKDB                                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  DATA SOURCES:                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ airports.parquet  - FAA airport facility data                          │    │
│  │ jira.duckdb       - JIRA issue tracker data                            │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  SQL EXAMPLE (generated from Cube.dev query):                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ SELECT                                                                  │    │
│  │   own_type AS "airports.own_type",                                     │    │
│  │   state AS "airports.state",                                           │    │
│  │   COUNT(*) AS "airports.count"                                         │    │
│  │ FROM read_parquet('/app/data/airports.parquet')                        │    │
│  │ WHERE state = 'CA'                                                     │    │
│  │   AND own_type = 'PR'                                                  │    │
│  │ GROUP BY own_type, state                                               │    │
│  │ ORDER BY "airports.count" DESC                                         │    │
│  │ LIMIT 100                                                              │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

```

## Query Types

### 1. Flat Query (POST /query)

Used for simple aggregations with grouping:

```json
// Request
{
  "measures": ["airports.count"],
  "dimensions": ["airports.state"],
  "filters": [
    {"member": "airports.own_type", "operator": "equals", "values": ["PR"]}
  ],
  "limit": 10
}

// Response
{
  "data": [
    {"airports.state": "TX", "airports.count": 1459},
    {"airports.state": "IL", "airports.count": 764},
    {"airports.state": "CA", "airports.count": 630}
  ],
  "annotation": {
    "measures": ["airports.count"],
    "dimensions": ["airports.state"]
  }
}
```

### 2. Nested Query (POST /nested-query)

Used for hierarchical drill-down (Malloy's signature capability):

```json
// Request
{
  "measures": ["airports.count"],
  "hierarchy": ["airports.own_type", "airports.state"],
  "limit": 3
}

// Response (nested structure)
{
  "data": [
    {
      "airports.own_type": "PR",
      "airports.count": 14306,
      "by_airports.state": [
        {"airports.state": "TX", "airports.count": 1459},
        {"airports.state": "IL", "airports.count": 764},
        {"airports.state": "CA", "airports.count": 630}
      ]
    },
    {
      "airports.own_type": "PU",
      "airports.count": 4698,
      "by_airports.state": [
        {"airports.state": "TX", "airports.count": 402},
        {"airports.state": "AK", "airports.count": 247}
      ]
    }
  ],
  "type": "nested",
  "hierarchy": ["own_type", "state"]
}
```

### 3. Chat Query (POST /chat/stream)

Natural language translated to structured query by OpenAI:

```json
// Request
{"message": "How many private airports in California?"}

// Response (Server-Sent Events)
data: {"type": "thinking", "tool": "list_models", "status": "running"}
data: {"type": "thinking", "tool": "list_models", "status": "complete", "duration": 50}
data: {"type": "thinking", "tool": "query", "status": "running", "args": {...}}
data: {"type": "thinking", "tool": "query", "status": "complete", "duration": 150}
data: {"type": "response", "content": "There are **630** private airports"}
data: {"type": "response", "content": " in California, according to"}
data: {"type": "response", "content": " the FAA airport facilities data."}
data: {"done": true, "thinkingSteps": 2, "thinkingTime": 200}
```

## Playground Flow

The Playground (http://localhost:8080) provides a visual query builder:

1. **Select Model**: Dropdown loads available models from `/models` endpoint
2. **View Schema**: Left sidebar shows measures, dimensions from `/models/{name}`
3. **Build Query**: Click to add measures and dimensions (hierarchy)
4. **Run Query**: Sends POST to `/nested-query` endpoint
5. **View Results**: Renders nested table, SQL, and JSON tabs

```
User Action                 API Call                Response
──────────────────────────────────────────────────────────────
Page Load           →   GET /health              → Connection status
                    →   GET /models              → Model list
Select "airports"   →   GET /models/airports     → Schema (dims, measures)
Click "count"       →   (local state update)     → Adds to selectedMeasures
Click "own_type"    →   (local state update)     → Adds to hierarchy[0]
Click "state"       →   (local state update)     → Adds to hierarchy[1]
Click "Run"         →   POST /nested-query       → Nested data result
```

## Chat Client Flow

The Chat Client (http://localhost:3000) provides AI-powered natural language:

1. **Enter Question**: Type natural language query
2. **Send to API**: POST to `/chat/stream` with message
3. **Thinking Events**: Shows AI tool usage (list_models, query, etc.)
4. **Streaming Response**: AI's answer streams in real-time
5. **Session Persistence**: Conversation history maintained per session

```
User Message                Internal Process              Response
──────────────────────────────────────────────────────────────────────
"How many airports?"  →   OpenAI: list_models         → Thinking event
                      →   OpenAI: describe_model      → Thinking event
                      →   OpenAI: query               → Thinking event
                      →   OpenAI generates answer     → Streaming text
```

## Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match | `{"member": "airports.state", "operator": "equals", "values": ["CA"]}` |
| `notEquals` | Not equal | `{"member": "airports.state", "operator": "notEquals", "values": ["CA"]}` |
| `contains` | Substring match | `{"member": "airports.name", "operator": "contains", "values": ["International"]}` |
| `notContains` | Not substring | Similar to above |
| `gt` | Greater than | `{"member": "airports.count", "operator": "gt", "values": ["100"]}` |
| `gte` | Greater than or equal | Similar to above |
| `lt` | Less than | Similar to above |
| `lte` | Less than or equal | Similar to above |

## Field Naming Convention

All fields use the format `model.field`:

| Format | Example | Description |
|--------|---------|-------------|
| Measure | `airports.count` | Aggregation metric |
| Dimension | `airports.state` | Grouping attribute |
| Filter member | `airports.own_type` | Filter target |

**Important**: This format is required for proper query parsing. The model name prefix
ensures unambiguous field references when multiple models are available.

## Common Field Values

For the `airports` model:

| Field | Common Values |
|-------|--------------|
| `airports.own_type` | "PR" (Private), "PU" (Public), "MA" (Military) |
| `airports.state` | Two-letter codes: "CA", "TX", "NY", etc. |
| `airports.fac_type` | "AIRPORT", "HELIPORT", "SEAPLANE BASE" |

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| "OpenAI not configured" | Missing `OPENAI_API_KEY` | Set env var in `.env.production` |
| "MCP server not running" | Process crashed | Check Docker logs, restart |
| "Model not found" | Invalid model name | Use `GET /models` to list valid models |
| "Invalid response" | Query error | Check field names use `model.field` format |
