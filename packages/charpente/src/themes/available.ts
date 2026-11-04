export const assertAvailable = (names: (string | undefined)[], themes: Record<string, unknown>): void => {
  for (const name of names) {
    if (name !== undefined && !themes[name]) {
      throw new Error(
        `charpente: unknown theme "${name}". charpente/lite only knows "solid": import "${name}" from "charpente/themes" and pass it in themes.`,
      )
    }
  }
}
