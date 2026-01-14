---
id: model-generator
title: Model Generator
sidebar_position: 5
description: Browser-based tool for auto-generating semantic YAML from Parquet files
keywords: [model, generator, parquet, yaml, duckdb-wasm]
---

# Model Generator

> ⚠️ **Experimental POC** - Browser-based tool for auto-generating semantic.yaml from Parquet files.

A standalone HTML application that uses DuckDB-WASM to introspect Parquet files and generate semantic layer YAML schemas.

## Overview

```
┌──────────────────┐     ┌──────────────────┐     ┌────────────────────────────┐
│  model-generator │────▶│  DuckDB-WASM     │────▶│  Schema Introspector       │
│  (drop file)     │     │  (browser)       │     │  → Generate semantic.yaml  │
└──────────────────┘     └──────────────────┘     └────────────────────────────┘
```

## Features

- ✅ Drag & drop Parquet file loading
- ✅ DuckDB-WASM for in-browser SQL
- ✅ Auto-column classification:
  - TIMESTAMP/DATE → time_dimensions
  - INT/FLOAT → measures (sum, avg)
  - VARCHAR (low cardinality) → dimensions
  - VARCHAR (high cardinality) → excluded
- ✅ Manual override for classification
- ✅ YAML generation with download
- ✅ Test queries in browser

## Quick Start

### Option 1: Python HTTP Server

```bash
cd playground
python -m http.server 8080
# Open http://localhost:8080/model-generator.html
```

### Option 2: Node.js HTTP Server

```bash
cd playground
npx serve .
# Open http://localhost:3000/model-generator.html
```

### Option 3: VS Code Live Server

Open `model-generator.html` in VS Code, right-click, and select "Open with Live Server".

## Usage

1. **Open the Model Generator** in your browser
2. **Drop a Parquet file** onto the drop zone (or click to select)
3. **Enter model name** (default: `my_data`)
4. **Review column classification** - adjust as needed using the dropdowns
5. **Test queries** using the sample query buttons
6. **Download semantic.yaml** for use with the MCP server

## Column Classification Logic

| Column Type | Cardinality | Classification |
|-------------|-------------|----------------|
| TIMESTAMP, DATE | any | time_dimension |
| INT, FLOAT, DECIMAL | ≥ 20 unique | measure |
| INT, FLOAT, DECIMAL | < 20 unique | dimension |
| VARCHAR, TEXT | < 1000 unique | dimension |
| VARCHAR, TEXT | ≥ 1000 unique | excluded (likely ID) |
| BOOLEAN | any | dimension |

## Generated YAML Format

The tool generates YAML compatible with the MalloyData MCP server:

```yaml
cubes:
  - name: my_data
    description: "Auto-generated schema from Parquet file"
    source:
      type: parquet
      path: ./data/my_data.parquet
    
    dimensions:
      - name: status
        type: string
        sql: status
        title: "Status"
        description: "status field with 5 unique values"
    
    measures:
      - name: count
        type: count
        title: "Count"
        description: "Total row count"
        
      - name: amount_sum
        type: sum
        sql: amount
        title: "Sum of Amount"
    
    time_dimensions:
      - name: created_at
        type: time
        sql: created_at
        title: "Created At"
        granularities: [year, quarter, month, week, day]
```

## Browser Requirements

- Modern browser with WebAssembly support
- Chrome 90+, Firefox 89+, Safari 15+, Edge 90+

## Technical Details

- **DuckDB-WASM**: v1.28.0 from CDN
- **UI Framework**: Tailwind CSS (CDN)
- **Fonts**: Inter + JetBrains Mono
- **No server required**: Everything runs in the browser
- **No data leaves browser**: Parquet processing is local

## Workflow Integration

After generating a semantic model:

1. Download the `semantic.yaml` file
2. Place it in the `models/` directory
3. Copy your Parquet file to `data/`
4. Restart the MCP server to load the new model
5. Use the [Playground](../playground/index.html) to query your data

## Related

- [Deployment Guide](./04-deployment.md) - Docker deployment patterns
