/// <reference types="astro/client" />

declare module 'virtual:charpente.css'

declare module 'virtual:charpente.theme' {
  export const activeTheme: (date?: Date) => string
}
