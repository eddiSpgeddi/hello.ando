import { mount } from "svelte";
import type { Island } from "../island.ts";
import Counter from "./Counter.svelte";

const island: Island = (el, props) => {
  el.replaceChildren(); // drop the fallback HTML
  mount(Counter, { target: el, props: { start: Number(props.start ?? 0) } });
};

export default island;
