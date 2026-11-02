import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#65a779",
    "accent2": "#e6a0b9"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22%238ab99a%22%20opacity%3D%22.65%22%3E%3Cpath%20d%3D%22M8%2031Q4%2019%2017%2020Q18%2030%208%2031M31%209Q30%200%2040%203Q40%2011%2031%209%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23e8a2bb%22%20opacity%3D%22.75%22%3E%3Ccircle%20cx%3D%2229%22%20cy%3D%2230%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2230%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2225%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2235%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2230%22%20r%3D%222%22%20fill%3D%22%23d9b863%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22%238ab99a%22%20opacity%3D%22.65%22%3E%3Cpath%20d%3D%22M8%2031Q4%2019%2017%2020Q18%2030%208%2031M31%209Q30%200%2040%203Q40%2011%2031%209%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23e8a2bb%22%20opacity%3D%22.75%22%3E%3Ccircle%20cx%3D%2229%22%20cy%3D%2230%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2235%22%20cy%3D%2230%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2225%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2235%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2230%22%20r%3D%222%22%20fill%3D%22%23d9b863%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
