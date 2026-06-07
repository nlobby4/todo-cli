/**
 * Type definitions for the todo application.
 *
 * @file Type definitions.
 */

/**
 * @typedef {object} Todo
 *
 * @property {number} id - Unique identifier.
 * @property {string} title - Short description of the task.
 * @property {string} [description] - Optional longer description.
 * @property {boolean} done - Whether the task is completed.
 * @property {"low" | "medium" | "high"} priority - Task priority level.
 * @property {string} createdAt - ISO 8601 creation timestamp.
 * @property {string | null} completedAt - ISO 8601 completion timestamp, or
 *   null.
 */

export {};
