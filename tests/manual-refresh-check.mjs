import { register } from "node:module";
register("./hooks.mjs", import.meta.url);

const { default: registerExtension } = await import("../extensions/agnes-tools.ts");
const providers = {};
registerExtension({
  registerTool: () => {},
  registerProvider: (id, def) => { providers[id] = def; },
  on: () => {},
});
// Simulate pi core: no credential, no env key, no stored models, network allowed
delete process.env.AGNES_API_KEY;
const published = {};
const models = await providers["agnes"].refreshModels({
  signal: undefined,
  stored: undefined,
  publish: async (p) => Object.assign(published, p),
  allowNetwork: true,
  credential: undefined,
});
console.log("discovered:", models.map((m) => m.id).join(", "));
console.log("persisted:", ((published.persist && published.persist.models) || []).map((m) => m.id).join(", "));
