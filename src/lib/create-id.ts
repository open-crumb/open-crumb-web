let count = 0;

/**
 * Creates an ID unique to this execution context.
 *
 * @param label An optional label to appear in the ID
 *
 * @returns The generated ID
 */
export default function createID(label?: string): string {
  return label ? `${label}.${count++}` : `${count++}`;
}
