import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#38bdf8",
    "accent2": "#818cf8"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%237db7dd%22%20stroke-width%3D%22.8%22%20opacity%3D%22.7%22%3E%3Cpath%20d%3D%22M14%205v18M6%209l16%2010M6%2019%2022%209M11%207l3%203%203-3M7%2012l4%201-1%204M17%2021l-3-3-3%203M21%2016l-4-1%201-4%22%2F%3E%3Cpath%20d%3D%22M36%2030v10m-4-8%208%206m-8%200%208-6%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%239bc9e4%22%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2212%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%2237%22%20r%3D%22.8%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%237db7dd%22%20stroke-width%3D%22.8%22%20opacity%3D%22.7%22%3E%3Cpath%20d%3D%22M14%205v18M6%209l16%2010M6%2019%2022%209M11%207l3%203%203-3M7%2012l4%201-1%204M17%2021l-3-3-3%203M21%2016l-4-1%201-4%22%2F%3E%3Cpath%20d%3D%22M36%2030v10m-4-8%208%206m-8%200%208-6%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%239bc9e4%22%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2212%22%20r%3D%221%22%2F%3E%3Ccircle%20cx%3D%229%22%20cy%3D%2237%22%20r%3D%22.8%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
