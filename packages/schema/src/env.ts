import { dirname } from "node:path";
import process from "node:process";
import assert from "node:assert";

export let WORKSPACE_ROOT = "";

try {
  WORKSPACE_ROOT = process.env["BUILD_WORKSPACE"] || process.cwd();
} catch {
  // no access
}

export function setWorkspaceRoot(path: string, parent = false): void {
  assert(!!path);

  // Check if the path is a URL
  try {
    const url = new URL(path);
    // If it's a valid URL, convert it to a pathname and use its parent
    WORKSPACE_ROOT = url.pathname;
  } catch {
    // Use the parent path by default
    WORKSPACE_ROOT = path;
  }

  if (parent) {
    WORKSPACE_ROOT = dirname(WORKSPACE_ROOT);
  }
}

export function setTestRoot(path: string) {
  assert(!!path);
  setWorkspaceRoot(path, true);
}
