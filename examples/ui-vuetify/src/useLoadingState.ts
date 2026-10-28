const loading = new URLSearchParams(window.location.search).get("state") === "loading"

export const rootAttrs = loading
  ? { "data-charpente-loading": "", "aria-busy": "true", inert: true }
  : {}
