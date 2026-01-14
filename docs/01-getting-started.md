---
id: getting-started
title: Getting Started
sidebar_position: 1
description: Quick guide to deploy MalloyData Agentic AI using Docker
keywords: [docker, deployment, setup, malloy, semantic-layer, duckdb]
---

# Getting Started

## Why MalloyData Agentic AI?

We've been building **Agentic AI Analytics** platforms using enterprise-grade semantic layers like **Cube.dev** and **Mondrian OLAP**. These solutions work great for production workloads with PostgreSQL, Snowflake, or BigQuery backends.

However, we needed something **simpler** for:

- 🎓 **Learning & Experimentation** - Understand semantic layers without complex infrastructure
- 🚀 **Small Projects** - Quick analytics for CSV/Parquet files without a database
- 💾 **Low Footprint** - Runs entirely in Docker with embedded DuckDB
- 📦 **Portable Data** - File-based (Parquet) instead of database connections

**MalloyData Agentic AI** is that solution - a lightweight, file-system-based semantic layer using **Malloy** + **DuckDB** that exposes the same MCP tools interface as our Cube.dev stack.

| Feature | Cube.dev Stack | MalloyData Stack |
|---------|---------------|------------------|
| **Data Source** | PostgreSQL, Snowflake, BigQuery | Parquet files (DuckDB) |
| **Semantic Layer** | Cube.dev | Malloy + YAML config |
| **Infrastructure** | Multi-container + Database | Single container |
| **Use Case** | Production analytics | Learning, POCs, small projects |
| **MCP Interface** | ✅ Same tools | ✅ Same tools |

---

Quick guide to deploy MalloyData Agentic AI using Docker.

## Prerequisites

- **Docker** and **Docker Compose** (v2.0+)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/senthilsweb/srp-bots.git
cd srp-bots/malloydata-agentic-ai
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env.production

# Edit with your OpenAI API key
nano .env.production
```

**Required environment variables:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | ✅ Yes | - | Your OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | OpenAI model to use |
| `MCP_BRIDGE_PORT` | No | `8006` | REST API port |
| `PLAYGROUND_PORT` | No | `8080` | Playground UI port |
| `LOG_LEVEL` | No | `INFO` | Logging level (DEBUG, INFO, WARN, ERROR) |

### 3. Start Services

```bash
# Build and start all services
docker compose --env-file .env.production up -d --build

# First build takes ~2 minutes (DuckDB compilation)
```

### 4. Verify Deployment

```bash
# Check health
curl http://localhost:8006/health

# Expected response:
# {"status":"healthy","service":"malloydata-mcp-bridge","version":"2.0.0",...}
```

## Access Services

| Service | URL | Description |
|---------|-----|-------------|
| **REST API** | http://localhost:8006 | Query API and health endpoints |
| **Playground** | http://localhost:8080 | Interactive query builder |
| **Health Check** | http://localhost:8006/health | Service status |

> **Note**: The Chat Client is deployed separately from the `bidb-sema-mcp-chat-bot-client` repository at port 3000.

## Test a Query

```bash
# List available models
curl http://localhost:8006/models | jq

# Query JIRA issues by status
curl -X POST http://localhost:8006/query \
  -H "Content-Type: application/json" \
  -d '{
    "measures": ["jira_issues.count"],
    "dimensions": ["jira_issues.status"]
  }' | jq
```

## Docker Commands

```bash
# Start services
docker compose --env-file .env.production up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose --env-file .env.production up -d --build

# Full rebuild (no cache)
docker compose --env-file .env.production build --no-cache
docker compose --env-file .env.production up -d
```

## Troubleshooting

### DuckDB Build Fails on ARM64 (Apple Silicon)

The Dockerfile uses `--platform=linux/amd64` to use prebuilt DuckDB binaries. If build fails:

```bash
# Force amd64 platform
docker compose --env-file .env.production build --no-cache
```

### Service Not Starting

```bash
# Check container status
docker ps -a

# View logs for specific service
docker logs malloydata-mcp-bridge

# Check if port is in use
lsof -i :8006
```

### OpenAI API Errors

1. Verify `OPENAI_API_KEY` is set correctly in `.env.production`
2. Check API key has sufficient credits
3. View logs: `docker logs malloydata-mcp-bridge 2>&1 | grep -i openai`

## Next Steps

- [API Reference](02-api-reference.md) - Full API and MCP tools documentation
- [Query Flow](03-query-flow.md) - How queries are processed
- [Deployment Guide](04-deployment.md) - Advanced deployment options
- [Architecture](06-architecture.md) - Technical design and comparison with Cube.dev
