export const booleanInert = (attributes: Record<string, string>): Record<string, string | boolean> => {
  const { inert, ...others } = attributes
  return inert === undefined ? others : { ...others, inert: true }
}
