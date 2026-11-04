import { expect, fail } from "./reporting.mjs"
import { urlOf } from "./site-urls.mjs"

export const checkGenerator = async (context) => {
  const page = await context.newPage()
  const errors = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(urlOf("generator"), { waitUntil: "networkidle" })
  await page.waitForSelector(".gen-stage")
  const code = () => page.locator(".gen-code-area").inputValue()
  const leaf = page.locator(".gen-stage h3")
  const style = (property) => leaf.evaluate((element, name) => getComputedStyle(element)[name], property)

  expect((await code()).includes("pattern: \x27solid\x27"), "generator: empty theme writes the short format")
  await page.selectOption("select >> nth=0", "cyberpunk")
  await page.waitForFunction(() => document.querySelector(".gen-code-area").value.includes("extends"))
  expect((await code()).includes("extends: \x27cyberpunk\x27"), "generator: starting from a built-in theme extends it")
  await page.getByRole("button", { name: "Pill" }).click()
  expect((await code()).includes("999px"), "generator: a shape preset reaches the file")
  expect((await style("borderRadius")).includes("999px"), "generator: a shape preset reaches the preview")
  await page.getByLabel("Paste a CSS fill").fill("linear-gradient(red, blue)")
  expect((await style("backgroundImage")).includes("rgb(255, 0, 0)"), "generator: a pasted fill applies at once")
  expect((await page.getByRole("button", { name: /^Save/ }).count()) === 0, "generator: hosted page has no save button")
  await page.locator("summary", { hasText: "Hover" }).click()
  await page.getByLabel("Fill on hover").fill("accent")
  await page.locator(".gen-card h3").hover()
  const hovered = await style("backgroundImage")
  expect(hovered.includes("rgb("), "generator: hover paint applies while hovering")
  const hash = await page.evaluate(() => new Promise((done) => setTimeout(() => done(location.hash), 500)))
  expect(hash.startsWith("#g="), "generator: the state is shared in the url")
  await page.reload({ waitUntil: "networkidle" })
  await page.waitForFunction(() => document.querySelector(".gen-code-area").value.includes("cyberpunk"))
  expect((await code()).includes("linear-gradient(red, blue)"), "generator: the url restores the theme")
  for (const error of errors) fail(`generator: ${error}`)
  await page.close()
}
