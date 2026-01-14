---
id: deployment
title: Deployment Guide
sidebar_position: 4
description: Advanced Docker deployment options and architecture details
keywords: [docker, deployment, architecture, containers]
---

# Deployment Guide

## Architecture Overview

This project implements a semantic layer for analytical queries using Malloy and DuckDB,
exposed through an MCP (Model Context Protocol) server with a REST API bridge and AI chat interface.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MALLOYDATA AGENTIC AI                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  HTTP    ┌─────────────────────┐  stdio   ┌───────────┐  │
│  │ Chat Client  │─────────▶│  MCP REST Bridge    │────────▶│ MCP Server │  │
│  │ (React/Nginx)│          │  (Python FastAPI)   │         │ (Node.js)  │  │
│  │ Port: 3000   │          │  Port: 8006         │         │            │  │
│  └──────────────┘          └─────────────────────┘         └─────┬──────┘  │
│         │                           │                            │         │
│         │                           │ OpenAI                     │ DuckDB  │
│         │                           ▼                            ▼         │
│         │                    ┌─────────────┐              ┌─────────────┐  │
│         │                    │ GPT-4o-mini │              │ Parquet     │  │
│         │                    │ (AI Agent)  │              │ Data Files  │  │
│         │                    └─────────────┘              └─────────────┘  │
│         │                                                                  │
│  ┌──────▼───────────────────────────────────────────────────────────────┐  │
│  │                         Query Playground                             │  │
│  │  • Build Cube.dev-compatible queries                                 │  │
│  │  • Nested/hierarchical Malloy-style queries                         │  │
│  │  • Real-time query execution                                        │  │
│  │  Port: 8080                                                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start with Docker

### Prerequisites

- Docker and Docker Compose
- OpenAI API key (for chat functionality)

### 1. Create Environment File

```bash
# .env.production
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Start All Services

```bash
# Build and start (first time takes ~1 min)
docker compose --env-file .env.production up -d --build

# View logs
docker compose logs -f
```

### 3. Access the Services

| Service | URL | Description |
|---------|-----|-------------|
| Chat Client | http://localhost:3000 | AI-powered natural language queries |
| Playground | http://localhost:8080 | Query builder interface |
| REST API | http://localhost:8006 | Direct API access |
| Health Check | http://localhost:8006/health | Service status |

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ============================================
  # MCP REST Bridge - AI Chat + Query API
  # ============================================
  mcp-rest-bridge:
    build:
      context: .
      dockerfile: mcp-rest-bridge/Dockerfile
    ports:
      - "8006:8006"
    environment:
      - PORT=8006
      - MCP_SERVER_PATH=/app/mcp-server
      - LOG_LEVEL=INFO
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_MODEL=gpt-4o-mini
    volumes:
      - ./data:/app/data:ro
    networks:
      - malloydata-network
    restart: unless-stopped

  # ============================================
  # Query Playground - Visual Query Builder
  # ============================================
  playground:
    build:
      context: .
      dockerfile: playground/Dockerfile
    ports:
      - "8080:80"
    environment:
      - VITE_API_ENDPOINT=http://localhost:8006
    depends_on:
      - mcp-rest-bridge
    networks:
      - malloydata-network
    restart: unless-stopped

  # ============================================
  # Chat Client - AI Chat Interface
  # ============================================
  chat-client:
    build:
      context: .
      dockerfile: chat-client/Dockerfile
    ports:
      - "3000:80"
    environment:
      - VITE_API_ENDPOINT=http://localhost:8006
      - VITE_STREAM_PATH=/chat/stream
    depends_on:
      - mcp-rest-bridge
    networks:
      - malloydata-network
    restart: unless-stopped

networks:
  malloydata-network:
    driver: bridge
```

---

## Key Technical Details

### DuckDB ARM64 Compatibility

> ⚠️ **IMPORTANT**: DuckDB npm packages for Node.js 18 on ARM64 (Apple Silicon) do not have 
> prebuilt binaries for versions > 1.0.0, causing compilation to take 5+ minutes.

**Solution Applied:**

1. Pin DuckDB to version 1.0.0 (has prebuilt binaries)
2. Use `--platform=linux/amd64` for x86 emulation (prebuilt binaries available)

```dockerfile
# mcp-rest-bridge/Dockerfile
FROM --platform=linux/amd64 node:18-slim
```

Build time: ~51 seconds (vs 5+ minutes without fix)

### Query Format (Cube.dev Compatible)

All queries use Cube.dev-compatible format with `model.field` notation:

```json
{
  "measures": ["airports.count"],
  "dimensions": ["airports.state", "airports.own_type"],
  "filters": [
    {"member": "airports.state", "operator": "equals", "values": ["CA"]}
  ],
  "limit": 100
}
```

### Common Field Values

| Field | Values |
|-------|--------|
| `airports.own_type` | "PR" (Private), "PU" (Public), "MA" (Military) |
| `airports.state` | Two-letter codes: "CA", "TX", "NY", etc. |
| `airports.fac_type` | "AIRPORT", "HELIPORT", "SEAPLANE BASE" |

---

## Environment Variables Reference

### MCP REST Bridge

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for chat |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model to use |
| `PORT` | No | `8006` | Server port |
| `HOST` | No | `0.0.0.0` | Bind address |
| `MCP_SERVER_PATH` | No | `../mcp-server` | Path to MCP server |
| `LOG_LEVEL` | No | `INFO` | DEBUG, INFO, WARN, ERROR |

### Chat Client

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_ENDPOINT` | Yes | - | REST bridge URL |
| `VITE_STREAM_PATH` | No | `/chat/stream` | SSE endpoint path |

---

## API Endpoints

### Chat (AI-Powered)

```bash
# Natural language query with streaming response
curl -X POST http://localhost:8006/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "How many private airports in California?"}'
```

### Query (Direct)

```bash
# Flat analytical query
curl -X POST http://localhost:8006/query \
  -H "Content-Type: application/json" \
  -d '{
    "measures": ["airports.count"],
    "dimensions": ["airports.state"],
    "filters": [{"member": "airports.own_type", "operator": "equals", "values": ["PR"]}],
    "limit": 10
  }'
```

### Nested Query (Malloy-style)

```bash
# Hierarchical query
curl -X POST http://localhost:8006/nested-query \
  -H "Content-Type: application/json" \
  -d '{
    "measures": ["airports.count"],
    "hierarchy": ["airports.own_type", "airports.state"],
    "limit": 5
  }'
```

### Models

```bash
# List available models
curl http://localhost:8006/models

# Get model schema
curl http://localhost:8006/models/airports
```

### Health Check

```bash
curl http://localhost:8006/health
```

---

## Troubleshooting

### "OpenAI not configured" Error

Ensure you're passing the environment file:

```bash
docker compose --env-file .env.production up -d
```

### Chat Returns Wrong Data

Check that your query uses the correct field format:
- ✅ Correct: `airports.count`, `airports.state`
- ❌ Wrong: `count`, `state`, `Airports.count`

### Build Takes Too Long

If build takes more than 2 minutes, check DuckDB version:

```bash
# In package.json, ensure:
"duckdb": "1.0.0"
```

### Container Keeps Restarting

Check logs for errors:

```bash
docker compose logs mcp-rest-bridge
```

---

## Project Structure

```
malloydata-agentic-ai/
├── docker-compose.yml        # Main orchestration file
├── .env.production          # OpenAI API key (git-ignored)
│
├── mcp-server/              # Node.js MCP server
│   ├── index.js             # Server implementation
│   ├── package.json         # Dependencies (DuckDB 1.0.0)
│   └── Dockerfile           # Build instructions
│
├── mcp-rest-bridge/         # Python FastAPI bridge
│   ├── server.py            # REST API + OpenAI chat
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Build with Node.js
│
├── playground/              # React query builder
│   ├── src/                 # React components
│   └── Dockerfile           # Nginx static server
│
├── chat-client/             # React chat interface
│   ├── src/                 # React components
│   └── Dockerfile           # Nginx static server
│
├── semantic-models/         # Malloy model definitions
│   └── airports.malloy      # Airport model
│
├── data/                    # Data files
│   ├── airports.parquet     # FAA airport data
│   └── jira.duckdb         # JIRA data
│
└── docs/                    # Documentation
    ├── deployment.md        # This file
    └── model-generator.md   # YAML model generator
```

---

## Related Documentation

- [Model Generator Guide](./05-model-generator.md) - Create YAML models from Parquet files
