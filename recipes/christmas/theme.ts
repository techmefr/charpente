import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#b91c1c",
    "accent2": "#15803d"
  },
  "dark": {
    "shine": "rgba(255,255,255,0.16)"
  },
  "paint": {
    "text": {
      "fill": "linear-gradient(90deg, color-mix(in srgb, var(--charpente-accent) 28%, transparent), color-mix(in srgb, var(--charpente-accent2) 16%, transparent))",
      "style": {
        "borderRadius": "4px"
      }
    },
    "control": {
      "fill": "linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 20%, transparent), color-mix(in srgb, var(--charpente-accent2) 12%, transparent))",
      "style": {
        "borderRadius": "6px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 45%, transparent)"
      }
    },
    "media": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cpath%20d%3D%22M-4%206Q12%2020%2028%206T60%206%22%20fill%3D%22none%22%20stroke%3D%22%236b9276%22%20stroke-width%3D%221%22%2F%3E%3Cg%20fill%3D%22%23eab308%22%3E%3Ccircle%20cx%3D%228%22%20cy%3D%2212%22%20r%3D%222%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%224%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2210%22%20r%3D%222%22%20fill%3D%22%23ef4444%22%2F%3E%3Ccircle%20cx%3D%2243%22%20cy%3D%222%22%20r%3D%222%22%20fill%3D%22%234ade80%22%2F%3E%3Cpath%20d%3D%22M21%2025v12m-6-6h12m-10-4%208%208m0-8-8%208%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%22.8%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cpath%20d%3D%22M-4%206Q12%2020%2028%206T60%206%22%20fill%3D%22none%22%20stroke%3D%22%236b9276%22%20stroke-width%3D%221%22%2F%3E%3Cg%20fill%3D%22%23eab308%22%3E%3Ccircle%20cx%3D%228%22%20cy%3D%2212%22%20r%3D%222%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%224%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2210%22%20r%3D%222%22%20fill%3D%22%23ef4444%22%2F%3E%3Ccircle%20cx%3D%2243%22%20cy%3D%222%22%20r%3D%222%22%20fill%3D%22%234ade80%22%2F%3E%3Cpath%20d%3D%22M21%2025v12m-6-6h12m-10-4%208%208m0-8-8%208%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%22.8%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
