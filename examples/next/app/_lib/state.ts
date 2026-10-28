export type SearchParams = Promise<{ state?: string | string[] }>

export const loadingAttributes = async (searchParams: SearchParams) => {
  const { state } = await searchParams
  const value = Array.isArray(state) ? state[0] : state
  return value === "loading"
    ? { "data-charpente-loading": "", "aria-busy": "true" as const, inert: true }
    : {}
}
