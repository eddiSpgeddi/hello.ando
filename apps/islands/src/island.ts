/**
 * What every island module default-exports. It receives the [data-island]
 * element (with its fallback HTML still inside) and the parsed data-props.
 */
export type Island = (el: HTMLElement, props: Record<string, unknown>) => void;

/** Event the Svelte counter fires and the React log listens for. */
export const COUNTER_CHANGE = "counter:change";
export type CounterChange = CustomEvent<{ count: number }>;
