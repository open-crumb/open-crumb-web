/**
 * Used to ensure all cases in a union type are accounted for. Example:
 *
 * ```
 * type State = 'pending' | 'done';
 *
 * const state: State = 'pending';
 *
 * switch (state) {
 *   case 'pending': ...
 *   case 'done': ...
 *   default:
 *     assertUnreachable(state);
 * }
 * ```
 */
export default function assertUnreachable(value: never): never {
	throw new Error("Unreachable code.");
}
