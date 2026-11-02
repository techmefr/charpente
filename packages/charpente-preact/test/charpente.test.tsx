import { renderToString } from "preact-render-to-string"
import { describe, expect, it } from "vitest"
import { Charpente } from "../src"

describe("Charpente", () => {
  it("renders a plain div when not loading", () => {
    expect(renderToString(<Charpente>hello</Charpente>)).toBe("<div>hello</div>")
  })

  it("adds the loading attributes", () => {
    const html = renderToString(<Charpente loading theme="solid">x</Charpente>)
    expect(html).toContain("data-charpente-loading")
    expect(html).toContain("aria-busy=\"true\"")
    expect(html).toContain("inert")
    expect(html).toContain("data-charpente-theme=\"solid\"")
  })

  it("uses the as tag and forwards props", () => {
    const html = renderToString(<Charpente as="ul" class="grid" data-testid="root" loading>x</Charpente>)
    expect(html.startsWith("<ul")).toBe(true)
    expect(html).toContain("class=\"grid\"")
    expect(html).toContain("data-testid=\"root\"")
  })

  it("sets the delay and stagger variables and merges style", () => {
    const html = renderToString(<Charpente loading delay={100} stagger={40} style={{ color: "red" }}>x</Charpente>)
    expect(html).toContain("--charpente-delay:100ms")
    expect(html).toContain("--charpente-stagger:40ms")
    expect(html).toContain("color:red")
  })

  it("sorts several motions", () => {
    const html = renderToString(<Charpente loading motion={["shimmer", "glitch"]}>x</Charpente>)
    expect(html).toContain("data-charpente-motion=\"glitch shimmer\"")
  })

  it("renders a status label only while loading", () => {
    expect(renderToString(<Charpente loading label="Loading">x</Charpente>)).toContain("role=\"status\"")
    expect(renderToString(<Charpente label="Loading">x</Charpente>)).not.toContain("role=\"status\"")
  })

  it("marks the zone to capture", () => {
    const html = renderToString(<Charpente capture="team">x</Charpente>)
    expect(html).toContain("data-charpente-capture=\"team\"")
    expect(html).toContain("data-charpente-block")
    expect(html).not.toContain("data-charpente-loading")
  })
})
