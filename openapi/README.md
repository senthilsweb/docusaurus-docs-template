# OpenAPI Specification

Place your OpenAPI spec file here as `openapi.yaml` or `openapi.json`.

The OpenAPI documentation is automatically served at `/api-reference` using the Scalar plugin.

## Alternative: Generate Static Docs

If you prefer static API docs, you can use docusaurus-openapi-docs plugin:

```bash
npm run docusaurus gen-api-docs myApi
```

To clean generated docs:

```bash
npm run docusaurus clean-api-docs myApi
```
