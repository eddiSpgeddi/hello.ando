<script lang="ts">
  import { buttonClass } from "ui";
  import { COUNTER_CHANGE } from "../island.ts";

  let { start = 0 }: { start?: number } = $props();
  // the prop is only a starting value, so copying it once is intended
  // svelte-ignore state_referenced_locally
  let count = $state(start);

  function increment() {
    count += 1;
    window.dispatchEvent(new CustomEvent(COUNTER_CHANGE, { detail: { count } }));
  }
</script>

<button class={buttonClass("primary")} type="button" onclick={increment}>
  Clicked {count} times
</button>
