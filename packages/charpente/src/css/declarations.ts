import type { Declarations, Tokens } from '../types'

const kebab = (property: string): string =>
  property.startsWith('--') ? property : property.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

export const declarations = (decls: Declarations = {}): string =>
  Object.entries(decls)
    .map(([property, value]) => `${kebab(property)}: ${value}`)
    .join('; ')

export const tokenDeclarations = (tokens: Tokens): string =>
  Object.entries(tokens)
    .map(([name, value]) => `--charpente-${name}: ${value}`)
    .join('; ')
