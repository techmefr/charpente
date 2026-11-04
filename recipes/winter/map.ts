const image = (body: string, box: string): string =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}" preserveAspectRatio="none">${body}</svg>`)}")`

const ridge = 'M0 -62C36 -72 72 -40 65 -8C55 25 77 52 41 64C16 74 -8 42 -34 48C-70 57 -83 21 -67 -8C-53 -35 -38 -52 0 -62Z'
const contourGroup = (x: number, y: number, rotation: number): string => {
  const rings = Array.from({ length: 12 }, (_, index) => {
    const scale = 0.26 + index * 0.17
    return `<path d="${ridge}" transform="scale(${scale})" vector-effect="non-scaling-stroke"/>`
  }).join('')
  return `<g transform="translate(${x} ${y}) rotate(${rotation})">${rings}</g>`
}
const map = image(
  `<g fill="none" stroke="#7996aa" stroke-opacity=".52">${contourGroup(70, 53, -25)}${contourGroup(307, 127, 28)}${contourGroup(125, 326, 50)}${contourGroup(516, 324, -15)}</g>`,
  '0 0 500 320',
)

export const alpineBackdrop = `#faf3e7 ${map} center / cover no-repeat`
