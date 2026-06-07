/**
 * Business logic for managing todo items.
 *
 * @file Todo service module.
 */

import { loadTodos, saveTodos } from "./store.js";

/**
 * Generate a new unique ID based on the current max.
 *
 * @param {import("./types.js").Todo[]} todos - Existing todos.
 *
 * @returns {number} New unique ID.
 */
function nextId(todos) {
  return todos.length === 0 ? 1 : Math.max(...todos.map((t) => t.id)) + 1;
}

/**
 * Add a new todo.
 *
 * @param {string} title - Task title.
 * @param {object} [options] - Optional fields.
 * @param {string} [options.description] - Long description.
 * @param {"low" | "medium" | "high"} [options.priority] - Priority level.
 *
 * @returns {import("./types.js").Todo} The created todo.
 */
export function addTodo(title, { description = "", priority = "medium" } = {}) {
  const todos = loadTodos();
  /** @type {import("./types.js").Todo} */
  const todo = {
    id: nextId(todos),
    title,
    description,
    done: false,
    priority,
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  todos.push(todo);
  saveTodos(todos);
  return todo;
}

/**
 * List todos, optionally filtered.
 *
 * @param {object} [filter] - Filter options.
 * @param {boolean} [filter.done] - Filter by completion status.
 * @param {"low" | "medium" | "high"} [filter.priority] - Filter by priority.
 *
 * @returns {import("./types.js").Todo[]} Matching todos.
 */
export function listTodos({ done, priority } = {}) {
  let todos = loadTodos();
  if (done !== undefined) todos = todos.filter((t) => t.done === done);
  if (priority) todos = todos.filter((t) => t.priority === priority);
  return todos;
}

/**
 * Mark a todo as done.
 *
 * @param {number} id - ID of the todo to complete.
 *
 * @returns {import("./types.js").Todo | null} Updated todo, or null if not
 *   found.
 */
export function completeTodo(id) {
  const todos = loadTodos();
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  todo.done = true;
  todo.completedAt = new Date().toISOString();
  saveTodos(todos);
  return todo;
}

/**
 * Remove a todo by ID.
 *
 * @param {number} id - ID of the todo to remove.
 *
 * @returns {boolean} True if removed, false if not found.
 */
export function removeTodo(id) {
  const todos = loadTodos();
  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  todos.splice(idx, 1);
  saveTodos(todos);
  return true;
}

/**
 * Get a single todo by ID.
 *
 * @param {number} id - ID to look up.
 *
 * @returns {import("./types.js").Todo | null} Found todo, or null.
 */
export function getTodo(id) {
  return loadTodos().find((t) => t.id === id) ?? null;
}
