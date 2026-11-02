export const flat = (color: string): string => `linear-gradient(${color}, ${color})`

export const tint = (token: string, percent: number): string =>
  `color-mix(in srgb, var(--charpente-${token}) ${percent}%, transparent)`

export const motif = (drawing: string, width = 48, height = 48): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${drawing}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}")`
}

export const splitTopLevel = (value: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of value) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      parts.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current.trim())
  return parts
}
