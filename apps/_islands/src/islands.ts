/*
 * The island loader. Finds every [data-island] element, waits for its trigger,
 * then imports the island's module and mounts it.
 *
 *   data-island     key in the registry below
 *   data-load       idle | visible | interaction (default: idle)
 *   data-props      JSON passed to mount()
 *
 * Each import() is its own chunk, so a framework's runtime is only downloaded
 * when a page actually has an island that uses it.
 */
import type { Island } from "./island.ts";

const registry: Record<string, () => Promise<{ default: Island }>> = {
  counter: () => import("./islands/counter.ts"),
  log: () => import("./islands/log.tsx"),
  "theme-toggle": () => import("./islands/theme-toggle.ts"),
};

type Trigger = (el: HTMLElement, load: () => void) => void;

const triggers: Record<string, Trigger> = {
  idle: (_el, load) =>
    "requestIdleCallback" in window ? requestIdleCallback(load) : setTimeout(load, 200),

  visible: (el, load) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    });
    observer.observe(el);
  },

  interaction: (el, load) => {
    const events = ["pointerenter", "focusin", "touchstart"] as const;
    const once = () => {
      for (const type of events) el.removeEventListener(type, once);
      load();
    };
    for (const type of events) el.addEventListener(type, once, { passive: true });
  },
};

async function hydrate(el: HTMLElement): Promise<void> {
  const name = el.dataset.island ?? "";
  const importIsland = registry[name];
  if (!importIsland) {
    console.warn(`No island registered as "${name}"`);
    return;
  }
  el.dataset.state = "loading";
  try {
    const { default: mount } = await importIsland();
    mount(el, JSON.parse(el.dataset.props ?? "{}"));
    el.dataset.state = "mounted";
  } catch (error) {
    el.dataset.state = "error";
    console.error(`Island "${name}" failed to mount`, error);
  }
}

for (const el of document.querySelectorAll<HTMLElement>("[data-island]")) {
  el.dataset.state = "waiting";
  const trigger = triggers[el.dataset.load ?? "idle"] ?? triggers.idle!;
  trigger(el, () => void hydrate(el));
}
