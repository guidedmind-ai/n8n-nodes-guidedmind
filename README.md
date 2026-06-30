# n8n-nodes-guidedmind

A native **n8n community node** for [GuidedMind](https://guidedmind.ai) — the no-code Context Platform. Adds a first-class **GuidedMind** node to your palette so you can query your knowledge base, ingest documents, and read/write agent memory without hand-wiring HTTP Request nodes.

This is a real installable node package (an npm module), not a workflow template. Once installed it appears in the nodes panel like Slack or Notion, can be used as a tool by the AI Agent node, and carries its own credentials.

## What's inside

One node, **GuidedMind**, with three resources:

| Resource | Operations |
| :--- | :--- |
| **Knowledge Base (RAG)** | Search |
| **Document** | Upload · Upload and Process |
| **Memory** | Add Short Messages · Get Short Messages · Store Long Memory · Search Long Memory |

Two credential types, because GuidedMind uses two separate keys:

| Credential | Header | Key prefix | Used by |
| :--- | :--- | :--- | :--- |
| **GuidedMind RAG API** | `X-API-Key` | `rk_` | RAG + Document resources |
| **GuidedMind Memory API** | `X-Memory-Api-Key` | `mk_` | Memory resource |

Both let you override the **Base URL** for self-hosted / staging instances (default `https://api.guidedmind.ai`).

The node sets `usableAsTool: true`, so an **AI Agent** can call `GuidedMind: Search` or `GuidedMind: Search Long Memory` directly as tools — no MCP plumbing required for users who prefer a native node.

## Install (end users)

**Verified install (once approved):** in n8n, go to **Settings → Community Nodes → Install**, search for `n8n-nodes-guidedmind`, and install.

**Manual install (self-hosted, before verification):**
```bash
# in your n8n custom nodes directory (e.g. ~/.n8n/custom)
npm install n8n-nodes-guidedmind
```
Then restart n8n. Set `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` if you want to use the node as an AI Agent tool.

## Build & test locally (developers)

Requires Node.js >= 20.15.

```bash
git clone https://github.com/guidedmind-ai/n8n-nodes-guidedmind.git
cd n8n-nodes-guidedmind
npm install
npm run build      # tsc + copies the SVG icon into dist/
npm run lint       # eslint-plugin-n8n-nodes-base — must pass for verification
```

To run the node inside a live n8n while developing:
```bash
npm run dev        # tsc --watch
# then link it into n8n's custom dir, or use the n8n-node CLI:
#   npx n8n-node dev
```

The compiled output in `dist/` is what ships; the `n8n` attribute in `package.json` points n8n at `dist/credentials/*.js` and `dist/nodes/GuidedMind/GuidedMind.node.js`.

## Publish & push to GitHub

```bash
# create the repo on github.com/guidedmind-ai first, then:
git init
git add .
git commit -m "Initial GuidedMind community node (RAG + Document + Memory)"
git branch -M main
git remote add origin https://github.com/guidedmind-ai/n8n-nodes-guidedmind.git
git push -u origin main
```

Publishing to npm is done **through GitHub Actions with provenance** (see `.github/workflows/publish.yml`), which n8n **requires** for verified nodes submitted from May 1st 2026 onward:

1. Add an `NPM_TOKEN` secret (an npm automation token) to the GitHub repo.
2. Cut a GitHub **Release** (tag e.g. `v0.1.0`). The workflow builds, lints, and runs `npm publish --provenance --access public`.
3. Do **not** `npm publish` from your laptop for verified releases — provenance must come from the Action.

## Submit for verification (nodes panel listing)

1. Confirm `npm run lint` passes and the package follows the [verified-node guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/): name starts with `n8n-nodes-`, includes the `n8n-community-node-package` keyword, **zero runtime dependencies**, English-only UI, no env/filesystem access.
2. Publish via the provenance workflow above.
3. Sign in to the **n8n Creator Portal** and submit `n8n-nodes-guidedmind` for review.

## Notes / to confirm before release

- **Document endpoint paths** (`/api/v1/documents/upload`, `/upload-and-process`) are inferred from the MCP tool names (`upload_document`, `upload_and_process`); confirm the exact REST routes against the GuidedMind API reference, since the public docs document these as MCP tools rather than REST routes. The RAG search route (`/api/v1/mcp/rag/search`) matches the existing n8n template. RAG search and memory routes are taken from the published API docs.
- The author email/repo URL in `package.json` are placeholders — set the real ones before publishing.
- Linting uses `eslint-plugin-n8n-nodes-base`; run `npm run lint:fix` to auto-resolve most style/convention findings.
