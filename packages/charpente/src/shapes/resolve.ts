import type { ShapeDef } from '../types'

export const resolveShape = (
  reference: string | ShapeDef | undefined,
  registry: Record<string, ShapeDef>,
): ShapeDef | undefined => {
  if (reference === undefined || typeof reference !== 'string') return reference
  const found = registry[reference]
  if (!found) {
    const known = Object.keys(registry)
    throw new Error(`charpente: unknown shape "${reference}"${known.length ? ` (known: ${known.join(', ')})` : ', import it from charpente/shapes and pass it in config.shapes'}`)
  }
  return found
}
