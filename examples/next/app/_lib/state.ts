export type SearchParams = Promise<{ state?: string | string[] }>

export const isLoading = async (searchParams: SearchParams): Promise<boolean> => {
  const { state } = await searchParams
  const value = Array.isArray(state) ? state[0] : state
  return value === "loading"
}
