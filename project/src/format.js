/**
 * Terminal formatting helpers for rendering todos.
 *
 * @file Format utilities.
 */

/** ANSI color codes. */
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

/**
 * Color for a priority level.
 *
 * @param {"low" | "medium" | "high"} priority - Priority level.
 *
 * @returns {string} ANSI color code.
 */
function priorityColor(priority) {
  if (priority === "high") return C.red;
  if (priority === "medium") return C.yellow;
  return C.green;
}

/**
 * Format a single todo for terminal output.
 *
 * @param {import("./types.js").Todo} todo - Todo to format.
 *
 * @returns {string} Formatted string.
 */
export function formatTodo(todo) {
  const check = todo.done ? `${C.green}✓${C.reset}` : `${C.gray}○${C.reset}`;
  const id = `${C.dim}#${todo.id}${C.reset}`;
  const title =
    todo.done ?
      `${C.dim}${todo.title}${C.reset}`
    : `${C.bold}${todo.title}${C.reset}`;
  const pColor = priorityColor(todo.priority);
  const pBadge = `${pColor}[${todo.priority}]${C.reset}`;
  const date = new Date(todo.createdAt).toLocaleDateString();
  const dateStr = `${C.gray}${date}${C.reset}`;

  let line = `  ${check} ${id} ${title} ${pBadge} ${dateStr}`;
  if (todo.description) {
    line += `\n     ${C.dim}${todo.description}${C.reset}`;
  }
  return line;
}

/**
 * Print a styled header.
 *
 * @param {string} text - Header text.
 *
 * @returns {void}
 */
export function printHeader(text) {
  console.log(`\n${C.cyan}${C.bold}${text}${C.reset}`);
  console.log(`${C.cyan}${"─".repeat(text.length)}${C.reset}`);
}

/**
 * Print a success message.
 *
 * @param {string} msg - Message to print.
 *
 * @returns {void}
 */
export function printSuccess(msg) {
  console.log(`${C.green}✓${C.reset} ${msg}`);
}

/**
 * Print an error message.
 *
 * @param {string} msg - Message to print.
 *
 * @returns {void}
 */
export function printError(msg) {
  console.error(`${C.red}✗${C.reset} ${msg}`);
}
