import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const Module = require("module");

const builtRoot = path.resolve(".test-build", "src").replace(/\\/g, "/");
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, ...rest) {
  const resolved = request.startsWith("@/") ? `${builtRoot}/${request.slice(2)}` : request;
  return originalResolve.call(this, resolved, ...rest);
};

const { strict: assert } = require("node:assert");

require("../.test-build/scripts/lib-tests.js");