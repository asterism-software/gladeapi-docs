# Glade API documentation

This repository contains the source for the public [Glade API documentation](https://docs.gladeapi.com). The site covers getting started, authentication, core concepts, guides, and the REST API reference.

## Links

- Product: [gladeapi.com](https://gladeapi.com)
- Documentation: [docs.gladeapi.com](https://docs.gladeapi.com)
- OpenAPI 3.1: [gladeapi.com/api/v1/openapi.json](https://gladeapi.com/api/v1/openapi.json)

## Repository structure

- `docs.json` configures branding, navigation, and site-wide behavior.
- `introduction.mdx`, `quickstart.mdx`, and `authentication.mdx` cover onboarding.
- `concepts/` explains shared API behavior.
- `guides/` contains task-oriented workflows.
- `api-reference/` contains endpoint reference pages.
- `logo/` and `glade-icon.png` contain production brand assets.

## Local development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm install --global mint
```

Start a local preview from the repository root:

```bash
mint dev
```

The preview is available at `http://localhost:3000` by default.

## Editing guidelines

- Follow the project instructions in `AGENTS.md`.
- Keep prose concise, task-oriented, and written in the second person.
- Verify REST paths, parameters, authentication, and schemas against the production OpenAPI document.
- Never commit credentials, customer data, internal routes, or implementation details.
- Update `docs.json` whenever a page is added, moved, or removed from navigation.

## Publishing changes

Create a branch, preview the documentation, and open a pull request. Mintlify generates a preview for review and deploys the production site after changes merge into `main`.

## Mintlify resources

- [Mintlify documentation](https://mintlify.com/docs)
- [Mintlify MCP](https://www.mintlify.com/docs/ai/mintlify-mcp)
- [Mintlify CLI](https://www.npmjs.com/package/mint)

## License

This repository is available under the MIT License. See `LICENSE`.
