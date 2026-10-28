import type { ReactNode } from "react"
import "./charpente.css"
import "./page.css"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
