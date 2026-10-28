import { createRawSnippet, flushSync, mount, unmount } from "svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Charpente from "../src/Charpente.svelte"

let host: HTMLElement
let instance: Record<string, unknown> | undefined

const content = createRawSnippet(() => ({ render: () => "<b>x</b>" }))

const isInert = (element: HTMLElement) => {
  const flag = (element as HTMLElement & { inert?: unknown }).inert
  return flag === true || (element.hasAttribute("inert") && element.getAttribute("inert") !== "false")
}

const render = (props: Record<string, unknown> = {}) => {
  instance = mount(Charpente, { target: host, props: { children: content, ...props } })
  flushSync()
  return host.firstElementChild as HTMLElement
}

beforeEach(() => {
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(() => {
  if (instance) unmount(instance)
  instance = undefined
  host.remove()
  vi.useRealTimers()
})

describe("Charpente", () => {
  it("renders a plain div when not loading", () => {
    const root = render()
    expect(root.tagName).toBe("DIV")
    expect(root.hasAttribute("data-charpente-loading")).toBe(false)
    expect(isInert(root)).toBe(false)
    expect(root.innerHTML).toContain("<b>x</b>")
  })

  it("adds the loading attributes", () => {
    const root = render({ loading: true, theme: "solid" })
    expect(root.hasAttribute("data-charpente-loading")).toBe(true)
    expect(root.getAttribute("aria-busy")).toBe("true")
    expect(isInert(root)).toBe(true)
    expect(root.getAttribute("data-charpente-theme")).toBe("solid")
  })

  it("uses the tag and forwards attributes", () => {
    const root = render({ tag: "ul", class: "grid", "data-testid": "root", loading: true })
    expect(root.tagName).toBe("UL")
    expect(root.className).toBe("grid")
    expect(root.getAttribute("data-testid")).toBe("root")
  })

  it("sets the delay and stagger variables and merges style", () => {
    const root = render({ loading: true, delay: 100, stagger: 40, style: "color:red" })
    expect(root.style.getPropertyValue("--charpente-delay")).toBe("100ms")
    expect(root.style.getPropertyValue("--charpente-stagger")).toBe("40ms")
    expect(root.style.color).toBe("red")
  })

  it("sorts several motions", () => {
    const root = render({ loading: true, motion: ["shimmer", "glitch"] })
    expect(root.getAttribute("data-charpente-motion")).toBe("glitch shimmer")
  })

  it("keeps the status region mounted and only fills it while loading", () => {
    render({ loading: true, label: "Loading" })
    expect(host.querySelector("[role=status]")?.textContent).toBe("Loading")
    unmount(instance!)
    host.innerHTML = ""
    instance = mount(Charpente, { target: host, props: { children: content, label: "Loading" } })
    flushSync()
    expect(host.querySelector("[role=status]")?.textContent).toBe("")
  })

  it("sets the ready attribute for revealMs after loading ends", () => {
    vi.useFakeTimers()
    const props = $state({ children: content, loading: true, revealMs: 300 })
    instance = mount(Charpente, { target: host, props })
    flushSync()
    const root = host.firstElementChild as HTMLElement
    expect(root.hasAttribute("data-charpente-ready")).toBe(false)
    props.loading = false
    flushSync()
    expect(root.hasAttribute("data-charpente-ready")).toBe(true)
    vi.advanceTimersByTime(299)
    flushSync()
    expect(root.hasAttribute("data-charpente-ready")).toBe(true)
    vi.advanceTimersByTime(2)
    flushSync()
    expect(root.hasAttribute("data-charpente-ready")).toBe(false)
  })
})
