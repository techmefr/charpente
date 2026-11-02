// @vitest-environment jsdom
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { Block, Charpente, Image, Pressable, Text } from "../src"

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

let host: HTMLElement
let root: Root

const render = async (tree: React.ReactNode) => {
  await act(async () => {
    root = createRoot(host)
    root.render(tree)
  })
}

const styleOf = (selector: string): Record<string, unknown> =>
  JSON.parse((host.querySelector(selector) as HTMLElement).getAttribute("data-style") ?? "{}")

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement("div")
  document.body.appendChild(host)
})

afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

describe("Charpente", () => {
  it("leaves the content untouched when nothing is loading", async () => {
    await render(
      <Charpente>
        <Text style={{ color: "red" }}>Hello</Text>
      </Charpente>,
    )
    expect(styleOf("span")).toEqual({ color: "red" })
    expect(host.textContent).toBe("Hello")
  })

  it("paints text with the theme color and hides the glyphs while loading", async () => {
    await render(
      <Charpente loading theme="solid" dark={false}>
        <Text style={{ fontSize: 16 }}>Hello</Text>
      </Charpente>,
    )
    expect(styleOf("span")).toMatchObject({ fontSize: 16, color: "transparent", backgroundColor: "#e5e7eb", borderRadius: 6, opacity: 1 })
  })

  it("uses the dark palette of the default theme", async () => {
    await render(
      <Charpente loading dark>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(styleOf("span")).toMatchObject({ backgroundColor: "#2a2d34" })
  })

  it("uses the colors and the radius of a custom theme", async () => {
    await render(
      <Charpente loading dark={false} themes={{ ocean: { colors: ["#112233", "#445566"], pattern: "solid", radius: "12px" } }} theme="ocean">
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(styleOf("span")).toMatchObject({ backgroundColor: "#112233", borderRadius: 12 })
  })

  it("replaces images with a painted view and hides the content of blocks and pressables", async () => {
    await render(
      <Charpente loading dark={false}>
        <Image source={{ uri: "x" }} style={{ width: 40, height: 40 }} />
        <Block style={{ height: 20 }}>
          <Text>Inside</Text>
        </Block>
        <Pressable style={{ padding: 8 }}>
          <Text>Go</Text>
        </Pressable>
      </Charpente>,
    )
    expect(host.querySelector("img")).toBeNull()
    expect(host.querySelectorAll("[data-style*='#e5e7eb']").length).toBeGreaterThanOrEqual(5)
    expect(host.querySelector("button")).toBeNull()
  })

  it("marks the container busy and blocks touches while loading", async () => {
    await render(
      <Charpente loading>
        <Text>Hello</Text>
      </Charpente>,
    )
    const container = host.firstElementChild as HTMLElement
    expect(container.getAttribute("data-busy")).toBe("true")
    expect(container.getAttribute("data-pointer")).toBe("none")
  })

  it("waits for the delay before showing the skeleton", async () => {
    await render(
      <Charpente loading delay={5000}>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect((host.firstElementChild as HTMLElement).getAttribute("data-busy")).toBe("false")
    expect(styleOf("span")).toEqual({})
  })
})
