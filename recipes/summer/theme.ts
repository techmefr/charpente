import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#d9a441",
    "accent2": "#38aab7"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ddae56%22%20stroke-width%3D%221%22%20opacity%3D%22.65%22%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%224%22%2F%3E%3Cpath%20d%3D%22M13%204V1m0%2024v-3M4%2013H1m24%200h-3M7%207%205%205m14%2014%202%202M7%2019l-2%202M19%207l2-2%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M20%2035q6-5%2012%200t12%200%22%20fill%3D%22none%22%20stroke%3D%22%2366b6be%22%20stroke-width%3D%221%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23ddae56%22%20stroke-width%3D%221%22%20opacity%3D%22.65%22%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%224%22%2F%3E%3Cpath%20d%3D%22M13%204V1m0%2024v-3M4%2013H1m24%200h-3M7%207%205%205m14%2014%202%202M7%2019l-2%202M19%207l2-2%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M20%2035q6-5%2012%200t12%200%22%20fill%3D%22none%22%20stroke%3D%22%2366b6be%22%20stroke-width%3D%221%22%20opacity%3D%22.6%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
