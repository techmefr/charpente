// @vitest-environment jsdom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Charpente, type CharpenteProps } from "../src"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

let host: HTMLElement
let root: Root

const render = async (props: CharpenteProps) => {
  await act(async () => {
    root = createRoot(host)
    root.render(<Charpente {...props}>x</Charpente>)
  })
  return host.firstElementChild as HTMLElement
}

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

describe("Charpente scope", () => {
  it("applies the loading state to the page when the scope is page", async () => {
    const element = await render({ loading: true, scope: "page" })
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(true)
    expect(document.documentElement.getAttribute("aria-busy")).toBe("true")
    expect(element.hasAttribute("data-charpente-loading")).toBe(false)
    await act(async () => root.unmount())
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(false)
    root = createRoot(host)
  })

  it("keeps the loading state on the element by default", async () => {
    const element = await render({ loading: true })
    expect(element.hasAttribute("data-charpente-loading")).toBe(true)
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(false)
  })

  it("follows the scope configured in the generated stylesheet", async () => {
    document.documentElement.style.setProperty("--charpente-scope", "page")
    const element = await render({ loading: true })
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(true)
    expect(element.hasAttribute("data-charpente-loading")).toBe(false)
    document.documentElement.style.removeProperty("--charpente-scope")
  })
})
