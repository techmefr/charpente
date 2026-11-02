import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { Charpente } from "../src"

describe("capture prop", () => {
  it("marks the zone even when nothing is loading", () => {
    const html = renderToStaticMarkup(<Charpente capture="team">x</Charpente>)
    expect(html).toContain("data-charpente-capture=\"team\"")
    expect(html).toContain("data-charpente-block=\"\"")
    expect(html).not.toContain("data-charpente-loading")
  })

  it("keeps the zone marked while loading", () => {
    const html = renderToStaticMarkup(<Charpente loading capture="team">x</Charpente>)
    expect(html).toContain("data-charpente-capture=\"team\"")
    expect(html).toContain("data-charpente-loading=\"\"")
  })
})
