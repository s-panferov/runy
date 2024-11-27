import { dirname } from "node:path";
import process from "node:process";
import assert from "node:assert";

export let WORKSPACE_ROOT = "";

try {
  WORKSPACE_ROOT = process.env["BUILD_WORKSPACE"] || process.cwd();
} catch {
  // no access
}

export function setWorkspaceRoot(path: string): void {
  assert(!!path);

  // Check if the path is a URL
  try {
    const url = new URL(path);
    // If it's a valid URL, convert it to a pathname
    WORKSPACE_ROOT = url.pathname;
  } catch {
    // If it's not a valid URL, use the path as-is
    WORKSPACE_ROOT = path;
  }

  if (WORKSPACE_ROOT.endsWith(".ts")) {
    WORKSPACE_ROOT = dirname(WORKSPACE_ROOT);
  }
}
