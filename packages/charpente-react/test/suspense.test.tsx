// @vitest-environment jsdom
import { act, lazy, type ReactNode } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { CharpenteSuspense } from "../src"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

let host: HTMLElement
let root: Root

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

describe("CharpenteSuspense", () => {
  it("shows the loading skeleton while the content is pending and the zone once it resolved", async () => {
    let release = (): void => undefined
    const Late = lazy(() => new Promise<{ default: () => ReactNode }>((done) => {
      release = () => done({ default: () => <p>ready</p> })
    }))

    await act(async () => {
      root = createRoot(host)
      root.render(
        <CharpenteSuspense capture="team" theme="solid" fallback={<p>placeholder</p>}>
          <Late />
        </CharpenteSuspense>,
      )
    })
    const pending = host.firstElementChild as HTMLElement
    expect(pending.hasAttribute("data-charpente-loading")).toBe(true)
    expect(pending.getAttribute("data-charpente-capture")).toBe("team")
    expect(pending.textContent).toBe("placeholder")

    await act(async () => release())
    const loaded = host.firstElementChild as HTMLElement
    expect(loaded.hasAttribute("data-charpente-loading")).toBe(false)
    expect(loaded.getAttribute("data-charpente-capture")).toBe("team")
    expect(loaded.textContent).toBe("ready")
  })

  it("keeps one zone mounted and plays the reveal when the content resolves", async () => {
    let release = (): void => undefined
    const Late = lazy(() => new Promise<{ default: () => ReactNode }>((done) => {
      release = () => done({ default: () => <p>ready</p> })
    }))

    await act(async () => {
      root = createRoot(host)
      root.render(
        <CharpenteSuspense capture="team" fallback={<p>placeholder</p>}>
          <Late />
        </CharpenteSuspense>,
      )
    })
    const zone = host.firstElementChild as HTMLElement
    expect(zone.hasAttribute("data-charpente-ready")).toBe(false)

    await act(async () => release())
    expect(host.firstElementChild).toBe(zone)
    expect(zone.hasAttribute("data-charpente-ready")).toBe(true)
  })

  it("announces the label on the fallback", async () => {
    const Never = lazy(() => new Promise<{ default: () => ReactNode }>(() => undefined))

    await act(async () => {
      root = createRoot(host)
      root.render(
        <CharpenteSuspense label="Loading team" fallback={<p>placeholder</p>}>
          <Never />
        </CharpenteSuspense>,
      )
    })
    const status = host.querySelector("span[role=status]")
    expect(status?.textContent).toBe("Loading team")
  })
})
