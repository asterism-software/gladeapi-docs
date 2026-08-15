# Glade API documentation instructions

## About this project

- This repository contains the public documentation for [Glade API](https://gladeapi.com).
- The production documentation site is [docs.gladeapi.com](https://docs.gladeapi.com).
- Glade API provides normalized Amazon marketplace data through REST, GraphQL, and MCP interfaces.
- Pages are MDX files with YAML frontmatter. Site configuration and navigation live in `docs.json`.
- The public OpenAPI 3.1 document at `https://gladeapi.com/api/v1/openapi.json` is the source of truth for REST paths, parameters, authentication, and response schemas.
- Use the Mintlify MCP server at `https://mcp.mintlify.com` to edit content and settings through an authenticated branch workflow.
- Use the Mintlify documentation MCP server at `https://www.mintlify.com/docs/mcp` for current Mintlify product guidance.

## Terminology

- Use **Glade API** for the product name. Do not shorten it to Glade when ambiguity is possible.
- Use **API key** for customer credentials and `API-KEY` when referring to the HTTP header.
- Use **marketplace** for an Amazon regional market such as US, UK, or DE.
- Use **unit** for metered usage. Do not substitute credit, request, or token unless the underlying contract uses that term.
- Use **REST**, **GraphQL**, and **MCP** for the three public interfaces.
- Use **Canopy-compatible** only when explaining compatibility. Do not imply affiliation with Canopy API.

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Put a working example before exhaustive parameter detail when possible.
- Use complete, copyable URLs in request examples.
- Keep examples consistent with the current OpenAPI document.
- Explain units, authentication, rate limits, and errors where they affect a workflow.

## Content boundaries

- Document only public product behavior and supported customer workflows.
- Do not document internal admin routes, providers, database structures, feature flags, or operational controls.
- Never include real API keys, credentials, customer data, private URLs, or internal repository details.
- Do not invent endpoints, parameters, response fields, marketplace coverage, limits, pricing, or availability claims.
- Treat the OpenAPI document and production product behavior as authoritative when generated content conflicts with them.
- Link dashboard actions to `https://gladeapi.com` and documentation links to `https://docs.gladeapi.com`.

## Repository workflow

- Keep navigation changes in `docs.json` synchronized with added, moved, or removed MDX pages.
- Work on a branch and review the rendered preview before merging into `main`.
- Run `mint dev` from the repository root for local previews.
- Check links, code examples, and referenced assets before publishing.
- Changes merged into `main` deploy automatically through Mintlify.
