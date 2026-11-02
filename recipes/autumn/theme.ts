import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#bd7f42",
    "accent2": "#a85e53"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22%23c5935b%22%20opacity%3D%22.6%22%3E%3Cpath%20d%3D%22M7%2024Q2%207%2022%207Q25%2023%207%2024%22%2F%3E%3Cpath%20d%3D%22M29%2040Q25%2025%2043%2024Q46%2039%2029%2040%22%20fill%3D%22%23b57260%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M5%2028%2018%2012m-8%209%200-6m3%203%206-1M27%2044l12-15%22%20fill%3D%22none%22%20stroke%3D%22%238c6545%22%20stroke-width%3D%22.8%22%20opacity%3D%22.65%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22%23c5935b%22%20opacity%3D%22.6%22%3E%3Cpath%20d%3D%22M7%2024Q2%207%2022%207Q25%2023%207%2024%22%2F%3E%3Cpath%20d%3D%22M29%2040Q25%2025%2043%2024Q46%2039%2029%2040%22%20fill%3D%22%23b57260%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M5%2028%2018%2012m-8%209%200-6m3%203%206-1M27%2044l12-15%22%20fill%3D%22none%22%20stroke%3D%22%238c6545%22%20stroke-width%3D%22.8%22%20opacity%3D%22.65%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
