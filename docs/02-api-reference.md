---
id: mcp-api-reference
title: MCP API Reference
sidebar_position: 2
description: Complete reference for REST API endpoints and MCP tools
keywords: [api, rest, mcp, tools, query, endpoints]
---

# API Reference

Complete reference for REST API endpoints and MCP tools.

## REST API Endpoints

All endpoints are served from the MCP REST Bridge at `http://localhost:8006`.

### Health & Discovery

#### `GET /health`

Health check endpoint returning service status.

**Response:**
```json
{
  "status": "healthy",
  "service": "malloydata-mcp-bridge",
  "version": "2.0.0",
  "mcp_server": "running",
  "chat_enabled": true,
  "openai_model": "gpt-4o-mini",
  "tools_count": 6
}
```

#### `GET /models`

List all available semantic models.

**Response:**
```json
{
  "models": [
    {
      "name": "jira_issues",
      "title": "JIRA Issues",
      "description": "JIRA/Zendesk issue tracking data...",
      "dimensionsCount": 20,
      "measuresCount": 7,
      "timeDimensionsCount": 4
    }
  ]
}
```

#### `GET /models/{model_name}`

Get detailed schema for a specific model.

**Example:** `GET /models/jira_issues`

**Response:**
```json
{
  "name": "jira_issues",
  "version": "3.0",
  "title": "JIRA Issues",
  "dimensions": [
    {"name": "status", "type": "string", "title": "Status"},
    {"name": "priority", "type": "string", "title": "Priority"}
  ],
  "measures": [
    {"name": "count", "type": "count", "title": "Issue Count"}
  ],
  "time_dimensions": [
    {"name": "created", "type": "time", "title": "Created Date"}
  ]
}
```

---

### Query Execution

#### `POST /query`

Execute an analytical query against a semantic model.

**Request Body:**
```json
{
  "measures": ["jira_issues.count"],
  "dimensions": ["jira_issues.status", "jira_issues.priority"],
  "timeDimensions": [
    {
      "dimension": "jira_issues.created",
      "granularity": "month",
      "dateRange": ["2025-01-01", "2025-12-31"]
    }
  ],
  "filters": [
    {
      "member": "jira_issues.status",
      "operator": "equals",
      "values": ["Open", "In Progress"]
    }
  ],
  "order": {"jira_issues.count": "desc"},
  "limit": 100
}
```

**Response:**
```json
{
  "data": [
    {"jira_issues.status": "Open", "jira_issues.priority": "High", "jira_issues.count": 42}
  ],
  "annotation": {
    "measures": ["jira_issues.count"],
    "dimensions": ["jira_issues.status", "jira_issues.priority"],
    "timeDimensions": []
  }
}
```

#### `POST /explain`

Get generated SQL without executing the query.

**Request Body:** Same as `/query`

**Response:**
```json
{
  "sql": "SELECT status, priority, COUNT(*) as count FROM ... GROUP BY status, priority",
  "malloy_query": "run: jira_issues -> { group_by: status, priority; aggregate: count }"
}
```

#### `POST /nested-query`

Execute hierarchical nested queries (Malloy N+1 style).

**Request Body:**
```json
{
  "measures": ["jira_issues.count"],
  "hierarchy": ["jira_issues.project", "jira_issues.status", "jira_issues.priority"],
  "granularities": {"jira_issues.created": "year"},
  "limit": 50
}
```

**Response:**
```json
{
  "data": [
    {
      "jira_issues.project": "PROJ-A",
      "jira_issues.count": 150,
      "_nested": [
        {
          "jira_issues.status": "Open",
          "jira_issues.count": 80,
          "_nested": [...]
        }
      ]
    }
  ]
}
```

---

### Chat Interface

#### `POST /chat/stream`

Stream AI-powered chat responses with tool usage.

**Request Body:**
```json
{
  "message": "How many issues were created in 2025 by status?",
  "session_id": "user-123"
}
```

**Response:** Server-Sent Events (SSE) stream
```
data: {"type": "thinking", "tool": "query", "status": "running"}
data: {"type": "thinking", "tool": "query", "status": "complete", "duration": 234}
data: {"type": "response", "content": "Here are the issues..."}
data: {"done": true, "thinkingSteps": 1, "thinkingTime": 234}
```

#### `POST /upload`

Upload files (placeholder for future functionality).

---

### Raw MCP Access

#### `POST /mcp`

Direct MCP JSON-RPC passthrough.

**Request Body:**
```json
{
  "method": "tools/call",
  "params": {
    "name": "query",
    "arguments": {
      "measures": ["jira_issues.count"]
    }
  }
}
```

---

## MCP Tools

These tools are exposed via the MCP server and used by AI agents.

### `list_models`

List all available semantic models (YAML definitions).

**Arguments:** None

**Returns:** Array of model summaries

---

### `describe_model`

Get detailed information about a specific model.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `modelName` | string | Yes | Name of the model |

**Example:**
```json
{"modelName": "jira_issues"}
```

---

### `get_schema`

Get the full YAML schema for a model or all models.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `modelName` | string | No | Model name (returns all if omitted) |

---

### `query`

Execute an analytical query against a semantic model.

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `measures` | array | Yes | Measures to aggregate (e.g., `["jira_issues.count"]`) |
| `dimensions` | array | No | Dimensions to group by |
| `timeDimensions` | array | No | Time dimensions with granularity |
| `filters` | array | No | Filter conditions |
| `order` | object | No | Sort order |
| `limit` | number | No | Max rows (default: 1000) |

**Filter Operators:**
- `equals`, `notEquals`
- `contains`
- `gt`, `gte`, `lt`, `lte`

**Time Granularities:**
- `year`, `quarter`, `month`, `week`, `day`

---

### `explain_query`

Show generated Malloy query and SQL without executing.

**Arguments:** Same as `query`

---

### `nested_query`

Execute hierarchical nested queries (Malloy N+1 style).

**Arguments:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `measures` | array | Yes | Measures to aggregate |
| `hierarchy` | array | Yes | Dimension hierarchy (up to 4 levels) |
| `granularities` | object | No | Time dimension granularities |
| `filters` | array | No | Filter conditions |
| `limit` | number | No | Max top-level rows (default: 50) |

---

## Query Format Reference

### Measure Format
```
{model_name}.{measure_name}
```
Examples: `jira_issues.count`, `jira_issues.story_points_sum`

### Dimension Format
```
{model_name}.{dimension_name}
```
Examples: `jira_issues.status`, `jira_issues.reporter`

### Time Dimension Object
```json
{
  "dimension": "jira_issues.created",
  "granularity": "month",
  "dateRange": ["2025-01-01", "2025-12-31"]
}
```

### Filter Object
```json
{
  "member": "jira_issues.status",
  "operator": "equals",
  "values": ["Open", "In Progress"]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "detail": "Additional details if available"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad request (invalid query)
- `404` - Model not found
- `500` - Internal server error
