/** The pieces of the wordmark, in order. Each one renders as its own <span>. */
export const LOCKUP_PARTS = ["~/", "hello", ".", "ando", "_"] as const;

/** What screen readers announce in place of the separate pieces. */
export const LOCKUP_LABEL = "hello.ando";

/**
 * Registers the <ui-lockup> custom element. Called when this module loads,
 * so importing "ui" is enough. Does nothing outside a browser (tests, SSR)
 * or if the tag is already registered. Needs ui/styles.css on the page.
 *
 * To show it before JS loads, write the spans yourself, with class="ui-lockup"
 * on the element: <ui-lockup class="ui-lockup"><span>~/</span>…</ui-lockup>
 * The element then adds only the role and label.
 */
export function defineLockup(tag = "ui-lockup"): void {
  if (typeof customElements === "undefined" || customElements.get(tag)) return;

  customElements.define(
    tag,
    class extends HTMLElement {
      connectedCallback() {
        this.classList.add("ui-lockup");
        this.setAttribute("role", "img");
        this.setAttribute("aria-label", LOCKUP_LABEL);
        // Spans already present: written into the HTML so it paints before JS
        // runs, or rendered before the element was moved. Keep them.
        if (this.childElementCount) return;
        this.replaceChildren(
          ...LOCKUP_PARTS.map((text) => {
            const span = document.createElement("span");
            span.textContent = text;
            return span;
          }),
        );
      }
    },
  );
}

defineLockup();
