#!/usr/bin/env node

/**
 * Entry point for the todo CLI application.
 *
 * Usage: todo add <title> [--desc <description>] [--priority low|medium|high]
 * todo list [--done] [--pending] [--priority low|medium|high] todo done <id>
 * todo remove <id> todo show <id> todo help.
 *
 * @file CLI entry point.
 */

import { formatTodo, printError, printHeader, printSuccess } from "./format.js";
import {
  addTodo,
  completeTodo,
  getTodo,
  listTodos,
  removeTodo,
} from "./todos.js";

const [, , command, ...args] = process.argv;

/**
 * Parse simple flag-based arguments from the args array.
 *
 * @param {string[]} argv - Argument list after the command.
 *
 * @returns {{
 *   positional: string[];
 *   flags: Record<string, string | boolean>;
 * }}
 *   Parsed args.
 */
function parseArgs(argv) {
  const positional = [];
  /** @type {Record<string, string | boolean>} */
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(argv[i]);
    }
  }
  return { positional, flags };
}

/** Display help text. */
function showHelp() {
  printHeader("todo-cli — a simple terminal task manager");
  console.log(`
  Commands:

    add <title> [--desc <text>] [--priority low|medium|high]
        Add a new todo item.

    list [--done] [--pending] [--priority low|medium|high]
        List todos. Default shows all.

    done <id>
        Mark a todo as completed.

    remove <id>
        Delete a todo permanently.

    show <id>
        Show full details for a todo.

    help
        Show this help message.
  `);
}

/** Handle the add command. */
function cmdAdd() {
  const { positional, flags } = parseArgs(args);
  const title = positional.join(" ");
  if (!title) {
    printError("Please provide a title: todo add <title>");
    process.exit(1);
  }
  const priority = /** @type {"low" | "medium" | "high"} */ (
    flags.priority ?? "medium"
  );
  const description = /** @type {string} */ (flags.desc ?? "");
  const todo = addTodo(title, { description, priority });
  printSuccess(`Added todo #${todo.id}: "${todo.title}"`);
}

/** Handle the list command. */
function cmdList() {
  const { flags } = parseArgs(args);
  /** @type {{ done?: boolean; priority?: "low" | "medium" | "high" }} */
  const filter = {};
  if (flags.done) filter.done = true;
  if (flags.pending) filter.done = false;
  if (flags.priority) {
    filter.priority = /** @type {"low" | "medium" | "high"} */ (flags.priority);
  }
  const todos = listTodos(filter);
  if (todos.length === 0) {
    console.log("\n  No todos found.");
    return;
  }
  const label =
    filter.done === true ? "Completed Todos"
    : filter.done === false ? "Pending Todos"
    : "All Todos";
  printHeader(`${label} (${todos.length})`);
  for (const todo of todos) {
    console.log(formatTodo(todo));
  }
  console.log();
}

/** Handle the done command. */
function cmdDone() {
  const id = parseInt(args[0], 10);
  if (isNaN(id)) {
    printError("Please provide a valid todo ID: todo done <id>");
    process.exit(1);
  }
  const todo = completeTodo(id);
  if (!todo) {
    printError(`Todo #${id} not found.`);
    process.exit(1);
  }
  printSuccess(`Marked #${id} as done: "${todo.title}"`);
}

/** Handle the remove command. */
function cmdRemove() {
  const id = parseInt(args[0], 10);
  if (isNaN(id)) {
    printError("Please provide a valid todo ID: todo remove <id>");
    process.exit(1);
  }
  const removed = removeTodo(id);
  if (!removed) {
    printError(`Todo #${id} not found.`);
    process.exit(1);
  }
  printSuccess(`Removed todo #${id}.`);
}

/** Handle the show command. */
function cmdShow() {
  const id = parseInt(args[0], 10);
  if (isNaN(id)) {
    printError("Please provide a valid todo ID: todo show <id>");
    process.exit(1);
  }
  const todo = getTodo(id);
  if (!todo) {
    printError(`Todo #${id} not found.`);
    process.exit(1);
  }
  printHeader(`Todo #${todo.id}`);
  console.log(formatTodo(todo));
  console.log(`\n  Created:   ${new Date(todo.createdAt).toLocaleString()}`);
  if (todo.completedAt) {
    console.log(`  Completed: ${new Date(todo.completedAt).toLocaleString()}`);
  }
  console.log();
}

// Route to the correct command
switch (command) {
  case "add":
    cmdAdd();
    break;
  case "list":
    cmdList();
    break;
  case "done":
    cmdDone();
    break;
  case "remove":
    cmdRemove();
    break;
  case "show":
    cmdShow();
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    showHelp();
    break;
  default:
    printError(`Unknown command: "${command}". Run "todo help" for usage.`);
    process.exit(1);
}
