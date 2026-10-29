import { createComponent, createSignal } from "solid-js"
import { render } from "solid-js/web"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { Charpente, type CharpenteProps } from "../src"

let host: HTMLElement
let dispose: () => void

const isInert = (element: HTMLElement) =>
  (element as HTMLElement & { inert?: unknown }).inert === true || element.hasAttribute("inert")

const mount = (props: CharpenteProps) => {
  dispose = render(() => createComponent(Charpente, props), host)
  return host.firstElementChild as HTMLElement
}

beforeEach(() => {
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(() => {
  dispose?.()
  host.remove()
  vi.useRealTimers()
})

describe("Charpente", () => {
  it("renders a plain div when not loading", () => {
    mount({ children: "hello" })
    expect(host.innerHTML).toBe("<div>hello</div>")
  })

  it("adds the loading attributes", () => {
    const root = mount({ loading: true, theme: "solid", children: "x" })
    expect(root.hasAttribute("data-charpente-loading")).toBe(true)
    expect(root.getAttribute("aria-busy")).toBe("true")
    expect(isInert(root)).toBe(true)
    expect(root.getAttribute("data-charpente-theme")).toBe("solid")
  })

  it("uses the tag and forwards props", () => {
    const root = mount({ tag: "ul", class: "grid", "data-testid": "root", loading: true, children: "x" } as CharpenteProps)
    expect(root.tagName).toBe("UL")
    expect(root.className).toBe("grid")
    expect(root.getAttribute("data-testid")).toBe("root")
  })

  it("sets the delay and stagger variables and merges style", () => {
    const root = mount({ loading: true, delay: 100, stagger: 40, style: { color: "red" }, children: "x" })
    expect(root.style.getPropertyValue("--charpente-delay")).toBe("100ms")
    expect(root.style.getPropertyValue("--charpente-stagger")).toBe("40ms")
    expect(root.style.color).toBe("red")
  })

  it("sorts several motions", () => {
    const root = mount({ loading: true, motion: ["shimmer", "glitch"], children: "x" })
    expect(root.getAttribute("data-charpente-motion")).toBe("glitch shimmer")
  })

  it("keeps the status region mounted and only fills it while loading", () => {
    mount({ loading: true, label: "Loading", children: "x" })
    expect(host.querySelector("[role=status]")?.textContent).toBe("Loading")
    dispose()
    host.innerHTML = ""
    mount({ label: "Loading", children: "x" })
    expect(host.querySelector("[role=status]")?.textContent).toBe("")
  })

  it("sets the ready attribute for revealMs after loading ends", () => {
    vi.useFakeTimers()
    const [loading, setLoading] = createSignal(true)
    const root = mount({
      get loading() {
        return loading()
      },
      revealMs: 300,
      children: "x",
    })
    expect(root.hasAttribute("data-charpente-ready")).toBe(false)
    setLoading(false)
    expect(root.hasAttribute("data-charpente-ready")).toBe(true)
    vi.advanceTimersByTime(299)
    expect(root.hasAttribute("data-charpente-ready")).toBe(true)
    vi.advanceTimersByTime(2)
    expect(root.hasAttribute("data-charpente-ready")).toBe(false)
  })

  it("does not set the ready attribute when it never loaded", () => {
    const root = mount({ loading: false, children: "x" })
    expect(root.hasAttribute("data-charpente-ready")).toBe(false)
  })
})
