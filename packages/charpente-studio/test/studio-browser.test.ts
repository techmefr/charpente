import { execSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync } from "node:fs"
import type { Server } from "node:http"
import type { AddressInfo } from "node:net"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { chromium, type Browser } from "playwright"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { startStudio } from "../src/server"

const dist = resolve(import.meta.dirname, "..", "dist")
let server: Server
let browser: Browser
let root = ""
let url = ""

beforeAll(async () => {
  if (!existsSync(join(dist, "client.js"))) execSync("pnpm build", { cwd: resolve(dist, ".."), stdio: "ignore" })
  root = mkdtempSync(join(tmpdir(), "charpente-save-"))
  server = await startStudio({ root, dir: "themes", port: 0, clientPath: join(dist, "client.js") })
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`
  browser = await chromium.launch()
}, 120_000)

afterAll(async () => {
  await browser?.close()
  server?.close()
})

describe("studio save button", () => {
  it("writes the file, then asks before overwriting", async () => {
    const page = await browser.newPage()
    const dialogs: string[] = []
    page.on("dialog", (dialog) => {
      dialogs.push(dialog.message())
      void dialog.dismiss()
    })
    await page.goto(url)
    await page.waitForSelector(".gen-code-area")
    await page.getByLabel("Theme name").fill("saved-one")
    await page.getByRole("button", { name: "Pill" }).click()
    const shown = await page.locator(".gen-code-area").inputValue()
    await page.getByRole("button", { name: /^Save/ }).click()
    await page.getByText(/^Saved /).waitFor()
    const file = join(root, "themes", "saved-one", "theme.ts")
    expect(readFileSync(file, "utf8")).toBe(shown)
    await page.getByRole("button", { name: "Square" }).click()
    await page.getByRole("button", { name: /^Save/ }).click()
    await page.waitForTimeout(500)
    expect(dialogs[0]).toContain("already exists")
    expect(readFileSync(file, "utf8")).toBe(shown)
    page.removeAllListeners("dialog")
    page.on("dialog", (dialog) => void dialog.accept())
    await page.getByRole("button", { name: /^Save/ }).click()
    await page.waitForFunction(() => document.querySelector(".gen-code .gen-status")?.textContent?.startsWith("Saved"))
    expect(readFileSync(file, "utf8")).toContain("radius: '0'")
    await page.close()
  }, 60_000)
})
