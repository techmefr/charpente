const PORTS = [5173, 3000, 4321, 4200, 8080, 8000]
const PROBE_TIMEOUT = 500

export const detectOrigin = async (): Promise<string | undefined> => {
  for (const port of PORTS) {
    const origin = `http://localhost:${port}`
    try {
      await fetch(origin, { signal: AbortSignal.timeout(PROBE_TIMEOUT) })
      return origin
    } catch {
      continue
    }
  }
  return undefined
}
