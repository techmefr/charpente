// @vitest-environment jsdom
import { render } from "preact"
import { act } from "preact/test-utils"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Charpente, type CharpenteProps } from "../src"

let host: HTMLElement

const mount = async (props: CharpenteProps) => {
  await act(() => render(<Charpente {...props}>x</Charpente>, host))
  return host.firstElementChild as HTMLElement
}

beforeEach(() => {
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(async () => {
  await act(() => render(null, host))
  host.remove()
})

describe("Charpente scope", () => {
  it("applies the loading state to the page when the scope is page", async () => {
    const element = await mount({ loading: true, scope: "page" })
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(true)
    expect(element.hasAttribute("data-charpente-loading")).toBe(false)
    await act(() => render(null, host))
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(false)
  })

  it("keeps the loading state on the element by default", async () => {
    const element = await mount({ loading: true })
    expect(element.hasAttribute("data-charpente-loading")).toBe(true)
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(false)
  })

  it("follows the scope configured in the generated stylesheet", async () => {
    document.documentElement.style.setProperty("--charpente-scope", "page")
    const element = await mount({ loading: true })
    expect(document.documentElement.hasAttribute("data-charpente-loading")).toBe(true)
    expect(element.hasAttribute("data-charpente-loading")).toBe(false)
    document.documentElement.style.removeProperty("--charpente-scope")
  })
})
