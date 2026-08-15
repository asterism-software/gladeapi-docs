import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(path.join(root, "docs.json"), "utf8"));
const contractLocation =
  process.argv[2] ?? config.api?.openapi ?? process.env.OPENAPI_DOCUMENT;

assert.ok(contractLocation, "docs.json must configure api.openapi");

async function loadContract(location) {
  if (/^https:\/\//.test(location)) {
    const response = await fetch(location);
    assert.equal(
      response.ok,
      true,
      `Could not fetch OpenAPI contract (${response.status})`,
    );
    return response.json();
  }
  return JSON.parse(await readFile(path.resolve(root, location), "utf8"));
}

async function mdxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await mdxFiles(fullPath)));
    if (entry.isFile() && entry.name.endsWith(".mdx")) files.push(fullPath);
  }
  return files;
}

function navigationPages(value, pages = []) {
  if (Array.isArray(value)) {
    for (const item of value) navigationPages(item, pages);
    return pages;
  }
  if (!value || typeof value !== "object") return pages;
  if (Array.isArray(value.pages)) {
    for (const page of value.pages) {
      if (typeof page === "string") pages.push(page);
      else navigationPages(page, pages);
    }
  }
  for (const [key, item] of Object.entries(value)) {
    if (key !== "pages") navigationPages(item, pages);
  }
  return pages;
}

const contract = await loadContract(contractLocation);
assert.equal(contract.openapi, "3.1.0");
if (contractLocation === config.api.openapi)
  assert.deepEqual(contract.servers, [{ url: "https://gladeapi.com" }]);
else
  assert.ok(
    Array.isArray(contract.servers) && contract.servers.length > 0,
    "The OpenAPI contract must define a server URL",
  );

const operations = new Map();
for (const [operationPath, pathItem] of Object.entries(contract.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!["get", "post", "put", "patch", "delete"].includes(method)) continue;
    const key = `${method.toUpperCase()} ${operationPath}`;
    const parameters = new Set(
      [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])].map(
        (parameter) => parameter.name,
      ),
    );
    operations.set(key, { parameters });
  }
}

assert.equal(
  operations.size,
  17,
  "The public OpenAPI contract must contain 17 operations",
);

const files = await mdxFiles(root);
const referencedOperations = new Map();
const forbidden = [
  [/api\.glade\.dev/i, "obsolete api.glade.dev host"],
  [/\bcanopy\b/i, "removed competitor name"],
  [/skills\/amazon-data\/SKILL\.md/i, "nonexistent Agent Skill"],
  [/\[[^\]]*GraphQL Playground/i, "nonexistent GraphQL playground link"],
  [/\bget_Amazon[A-Za-z]+\b/, "obsolete MCP tool name"],
];

for (const file of files) {
  const source = await readFile(file, "utf8");
  const relative = path.relative(root, file);
  for (const [pattern, description] of forbidden)
    assert.doesNotMatch(source, pattern, `${relative}: ${description}`);

  if (relative.startsWith("api-reference/")) {
    const match = source.match(
      /^openapi:\s+"(GET|POST|PUT|PATCH|DELETE) ([^"]+)"$/m,
    );
    assert.ok(match, `${relative}: missing OpenAPI frontmatter`);
    const key = `${match[1]} ${match[2]}`;
    assert.ok(operations.has(key), `${relative}: ${key} is not in OpenAPI`);
    assert.equal(
      referencedOperations.has(key),
      false,
      `${relative}: duplicate documentation for ${key}`,
    );
    referencedOperations.set(key, relative);
  }

  const urlPattern =
    /https:\/\/gladeapi\.com(\/api\/amazon\/[A-Za-z0-9_./-]+)(?:\?([^"'`\s\\]+))?/g;
  for (const match of source.matchAll(urlPattern)) {
    const operationPath = match[1];
    if (operationPath.endsWith("/")) continue;
    const key = `GET ${operationPath}`;
    assert.ok(operations.has(key), `${relative}: undocumented endpoint ${key}`);
    const allowedParameters = operations.get(key).parameters;
    for (const parameter of (match[2] ?? "").matchAll(
      /(?:^|&)([A-Za-z][A-Za-z0-9]*)=/g,
    ))
      assert.ok(
        allowedParameters.has(parameter[1]),
        `${relative}: ${parameter[1]} is not valid for ${key}`,
      );
  }
}

assert.deepEqual(
  [...referencedOperations.keys()].sort(),
  [...operations.keys()].sort(),
  "API reference pages must cover every OpenAPI operation exactly once",
);

for (const page of navigationPages(config.navigation)) {
  if (/^(GET|POST|PUT|PATCH|DELETE) /.test(page)) continue;
  assert.equal(
    await readFile(path.join(root, `${page}.mdx`), "utf8").then(
      () => true,
      () => false,
    ),
    true,
    `Navigation page does not exist: ${page}`,
  );
}

console.log(
  `Validated ${files.length} MDX files and ${operations.size} OpenAPI operations.`,
);
