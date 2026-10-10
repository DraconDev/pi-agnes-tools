import { register } from "node:module";
import { readFileSync, writeFileSync } from "node:fs";
register("./hooks.mjs", import.meta.url);

const { default: registerExtension } = await import("../extensions/agnes-tools.ts");
const providers = {};
registerExtension({
  registerTool: () => {},
  registerProvider: (id, def) => { providers[id] = def; },
  on: () => {},
});

const seedModels = providers["agnes"].models.map((m) => ({
  ...m,
  api: "openai-completions",
  provider: "agnes",
  baseUrl: "https://apihub.agnes-ai.com/v1",
}));

const path = "/home/dracon/.pi/agent/models-store.json";
const store = JSON.parse(readFileSync(path, "utf8"));
store["agnes"] = { models: seedModels, checkedAt: Date.now() };
writeFileSync(path, JSON.stringify(store, null, 1));
console.log("wrote agnes models:", seedModels.map((m) => m.id).join(", "));
