// Splash, load version: ends the splash once the page has loaded, and not
// before it has been on screen for MIN_SHOWN_MS. Pair with splash-load.css,
// which runs the exit animations when .splash-done appears on <html> and
// removes the splash after 6s by itself if this never runs.

/** The shortest time the splash stays up, so a fast load doesn't just flash it. */
const MIN_SHOWN_MS = 1500;

const loaded = new Promise<void>((resolve) => {
  if (document.readyState === "complete") resolve();
  else addEventListener("load", () => resolve(), { once: true });
});

// performance.now() counts from the start of navigation, so time spent
// before this module ran counts towards the minimum.
const minShown = new Promise<void>((resolve) => {
  setTimeout(resolve, Math.max(0, MIN_SHOWN_MS - performance.now()));
});

void Promise.all([loaded, minShown]).then(() => {
  document.documentElement.classList.add("splash-done");
});
