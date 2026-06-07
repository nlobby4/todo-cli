/**
 * Persistent storage layer for todo items using a JSON file.
 *
 * @file Todo store module.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Path to the data directory relative to this file. */
const DATA_DIR = join(__dirname, "../../project/data");

/** Path to the todos JSON file. */
const TODOS_FILE = join(DATA_DIR, "todos.json");

/**
 * Ensure the data directory and todos file exist.
 *
 * @returns {void}
 */
function ensureStorage() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(TODOS_FILE)) {
    writeFileSync(TODOS_FILE, JSON.stringify([], null, 2), "utf8");
  }
}

/**
 * Load all todos from disk.
 *
 * @returns {import("./types.js").Todo[]} Array of todo items.
 */
export function loadTodos() {
  ensureStorage();
  const raw = readFileSync(TODOS_FILE, "utf8");
  return JSON.parse(raw);
}

/**
 * Save todos to disk.
 *
 * @param {import("./types.js").Todo[]} todos - Array of todo items to persist.
 *
 * @returns {void}
 */
export function saveTodos(todos) {
  ensureStorage();
  writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2), "utf8");
}
