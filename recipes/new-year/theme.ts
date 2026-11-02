import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#c6a04b",
    "accent2": "#a78bfa"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23c6a04b%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M13%204v14m-7-7h14M8%206l10%2010M8%2016%2018%206M35%2029v10m-5-5h10%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m27%209%202%204m-21%2022%203-2m29-14-2%203%22%20stroke%3D%22%23a78bfa%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%2223%22%20cy%3D%2242%22%20r%3D%221%22%20fill%3D%22%23c6a04b%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23c6a04b%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M13%204v14m-7-7h14M8%206l10%2010M8%2016%2018%206M35%2029v10m-5-5h10%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22m27%209%202%204m-21%2022%203-2m29-14-2%203%22%20stroke%3D%22%23a78bfa%22%20stroke-width%3D%222%22%2F%3E%3Ccircle%20cx%3D%2223%22%20cy%3D%2242%22%20r%3D%221%22%20fill%3D%22%23c6a04b%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
