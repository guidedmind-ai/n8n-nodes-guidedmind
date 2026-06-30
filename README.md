# n8n-nodes-guidedmind

A native **n8n community node** for [GuidedMind](https://guidedmind.ai) — the no-code Context Platform. Query your knowledge base, ingest documents, and manage agent memory directly from n8n workflows.

## What it does

One node, **GuidedMind**, with three resources:

| Resource | Operations |
| :--- | :--- |
| **Knowledge Base (RAG)** | Search |
| **Document** | Upload · Upload and Process |
| **Memory** | Add Short Messages · Get Short Messages · Store Long Memory · Search Long Memory |

The node can also be used as a **tool by the AI Agent** node — enabling AI agents to search your knowledge base or query memory without extra configuration.

## Install

### Via n8n Community Nodes panel (recommended)

1. In n8n, go to **Settings → Community Nodes → Install**
2. Search for `n8n-nodes-guidedmind`
3. Click **Install** and restart n8n if prompted

### Manual install (self-hosted)

```bash
# In your n8n custom nodes directory (e.g. ~/.n8n/custom)
npm install n8n-nodes-guidedmind
```

Then restart n8n. To enable AI Agent tool usage, set:
```bash
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## Configure credentials

GuidedMind uses two separate API keys:

| Credential | Header | Key prefix | Used by |
| :--- | :--- | :--- | :--- |
| **GuidedMind RAG API** | `X-API-Key` | `rk_` | RAG + Document |
| **GuidedMind Memory API** | `X-Memory-Api-Key` | `mk_` | Memory |

1. In n8n, go to **Settings → Credentials**
2. Create a **GuidedMind RAG API** credential with your `rk_` key
3. Create a **GuidedMind Memory API** credential with your `mk_` key
4. Both credentials let you override the **Base URL** for self-hosted or staging instances (default: `https://api.guidedmind.ai`)

## Use in workflows

Add the **GuidedMind** node to your workflow, select a resource (Knowledge Base, Document, or Memory), choose an operation, and attach the corresponding credential.

For AI Agent workflows, the node is marked `usableAsTool: true` — simply add it as a tool on your AI Agent node and it will automatically call `Search` or `Search Long Memory` when relevant.

---

## For developers

<details>
<summary>Click to expand build & publish instructions</summary>

### Build & test locally

Requires Node.js >= 20.15.

```bash
git clone https://github.com/guidedmind-ai/n8n-nodes-guidedmind.git
cd n8n-nodes-guidedmind
npm install
npm run build   # tsc + copies SVG icon into dist/
npm run lint    # must pass for verification
```

To run inside a live n8n while developing:
```bash
npm run dev     # tsc --watch
```

### Publish to npm

Publishing is done via **GitHub Actions with npm provenance** (required for n8n verified nodes from May 2026):

1. Configure a [Trusted Publisher](https://www.npmjs.com/settings/guidedmind/packages/n8n-nodes-guidedmind/pubkeys) on npm (GitHub Actions → `guidedmind-ai/n8n-nodes-guidedmind` → `publish.yml`)
2. Run `npm run release` — this bumps the version, tags, and pushes
3. The `v*` tag triggers `.github/workflows/publish.yml`, which builds, lints, and publishes with provenance

### Submit for verification

1. Confirm `npm run lint` passes and the package follows the [verified-node guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/)
2. Publish via the provenance workflow above
3. Sign in to the [n8n Creator Portal](https://n8n.io/creator-portal) and submit `n8n-nodes-guidedmind` for review

</details>
