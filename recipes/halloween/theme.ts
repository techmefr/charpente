import type { ThemeDef } from 'charpente'

export default {
  "tokens": {
    "accent": "#f97316",
    "accent2": "#8b5cf6"
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
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a78bfa%22%20stroke-width%3D%22.7%22%20opacity%3D%22.7%22%3E%3Cpath%20d%3D%22M0%200L48%2048M0%200L48%2016M0%200L16%2048M0%2012Q10%2010%2012%200M0%2025Q21%2021%2025%200M0%2040Q34%2034%2040%200%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M34%2032q0-6%205-6t5%206v7l-2-2-3%202-3-2-2%202z%22%20fill%3D%22%23fb923c%22%20opacity%3D%22.6%22%2F%3E%3Cpath%20d%3D%22M37%2031v2m4-2v2%22%20stroke%3D%22%23432465%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px",
        "boxShadow": "inset 0 0 0 1px color-mix(in srgb, var(--charpente-accent) 24%, transparent)"
      }
    },
    "block": {
      "fill": "url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2248%22%20height%3D%2248%22%20viewBox%3D%220%200%2048%2048%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23a78bfa%22%20stroke-width%3D%22.7%22%20opacity%3D%22.7%22%3E%3Cpath%20d%3D%22M0%200L48%2048M0%200L48%2016M0%200L16%2048M0%2012Q10%2010%2012%200M0%2025Q21%2021%2025%200M0%2040Q34%2034%2040%200%22%2F%3E%3C%2Fg%3E%3Cpath%20d%3D%22M34%2032q0-6%205-6t5%206v7l-2-2-3%202-3-2-2%202z%22%20fill%3D%22%23fb923c%22%20opacity%3D%22.6%22%2F%3E%3Cpath%20d%3D%22M37%2031v2m4-2v2%22%20stroke%3D%22%23432465%22%2F%3E%3C%2Fsvg%3E\"), linear-gradient(135deg, color-mix(in srgb, var(--charpente-accent) 12%, transparent), color-mix(in srgb, var(--charpente-accent2) 8%, transparent))",
      "size": "48px 48px, auto",
      "style": {
        "borderRadius": "8px"
      }
    }
  }
} satisfies ThemeDef
