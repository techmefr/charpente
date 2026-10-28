export const openingTag = (raw: string, marker: string): string => {
  const start = raw.indexOf(marker)
  const end = raw.indexOf('\n>', start)
  return raw.slice(start, end < 0 ? raw.indexOf('\n', start) : end + 2)
}

export const throughLine = (raw: string, marker: string): string => {
  const at = raw.indexOf(marker)
  return raw.slice(0, raw.indexOf('\n', at))
}

export const firstLines = (raw: string, count: number): string =>
  `${raw.split('\n').slice(0, count).join('\n')}\n  ...`

export const firstLine = (raw: string): string => raw.split('\n')[0] ?? ''
