import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { COUNTER_CHANGE, type CounterChange, type Island } from "../island.ts";

function Log({ limit }: { limit: number }) {
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    const onChange = (event: Event) => {
      const { count } = (event as CounterChange).detail;
      const time = new Date().toLocaleTimeString();
      setEntries((prev) => [`${time}: count is ${count}`, ...prev].slice(0, limit));
    };
    window.addEventListener(COUNTER_CHANGE, onChange);
    return () => window.removeEventListener(COUNTER_CHANGE, onChange);
  }, [limit]);

  if (entries.length === 0) {
    return <p className="muted">Mounted. Click the Svelte counter above.</p>;
  }
  return (
    <ol className="log" aria-live="polite">
      {entries.map((entry) => (
        <li key={entry}>{entry}</li>
      ))}
    </ol>
  );
}

const island: Island = (el, props) => {
  // createRoot replaces the fallback HTML on first render
  createRoot(el).render(<Log limit={Number(props.limit ?? 5)} />);
};

export default island;
