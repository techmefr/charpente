const round = (value: number): number => Math.round(value * 10) / 10

export const rrect = (x: number, y: number, width: number, height: number, radius: number): string => {
  const right = x + width
  const bottom = y + height
  const r = radius
  return [
    `M${x + r} ${y}H${right - r}A${r} ${r} 0 0 1 ${right} ${y + r}V${bottom - r}`,
    `A${r} ${r} 0 0 1 ${right - r} ${bottom}H${x + r}A${r} ${r} 0 0 1 ${x} ${bottom - r}V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}Z`,
  ].join('')
}

export const disc = (cx: number, cy: number, radius: number): string =>
  `M${round(cx - radius)} ${cy}a${radius} ${radius} 0 1 0 ${radius * 2} 0a${radius} ${radius} 0 1 0 ${-radius * 2} 0Z`
