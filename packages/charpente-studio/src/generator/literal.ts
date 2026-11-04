const IDENTIFIER = /^[A-Za-z_$][\w$]*$/
const SPACE = /\s/
const NUMBER = /^-?\d+(\.\d+)?/
const WORD = /^[A-Za-z_$][\w$]*/

export type Literal = string | number | boolean | null | Literal[] | { [key: string]: Literal }

const quote = (value: string): string => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\s+/g, ' ')}'`

export const toLiteral = (value: unknown, depth = 0): string => {
  if (typeof value === 'string') return quote(value)
  if (value === null) return 'null'
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.map((item) => toLiteral(item, depth)).join(', ')}]`
  const entries = Object.entries(value as Record<string, unknown>).filter(([, item]) => item !== undefined)
  if (entries.length === 0) return '{}'
  const pad = '  '.repeat(depth + 1)
  const lines = entries.map(([key, item]) => `${pad}${IDENTIFIER.test(key) ? key : quote(key)}: ${toLiteral(item, depth + 1)},`)
  return `{\n${lines.join('\n')}\n${'  '.repeat(depth)}}`
}

class Reader {
  private position = 0
  constructor(private readonly text: string) {}

  private fail(message: string): never {
    throw new Error(`charpente-studio: cannot read this theme file (${message})`)
  }

  private skip(): void {
    for (;;) {
      while (SPACE.test(this.text[this.position] ?? 'x')) this.position++
      if (this.text.startsWith('//', this.position)) this.position = this.text.indexOf('\n', this.position) === -1 ? this.text.length : this.text.indexOf('\n', this.position)
      else if (this.text.startsWith('/*', this.position)) this.position = this.text.indexOf('*/', this.position) + 2 || this.text.length
      else return
    }
  }

  private string(): string {
    const end = this.text[this.position++]
    let out = ''
    while (this.position < this.text.length && this.text[this.position] !== end) {
      const char = this.text[this.position++] as string
      if (end === '`' && char === '$' && this.text[this.position] === '{') this.fail('template expressions')
      out += char === '\\' ? (this.text[this.position++] ?? '') : char
    }
    if (this.text[this.position++] !== end) this.fail('unterminated string')
    return out
  }

  private list(close: string, item: () => void): void {
    this.position++
    for (;;) {
      this.skip()
      if (this.text[this.position] === close) {
        this.position++
        return
      }
      item()
      this.skip()
      if (this.text[this.position] === ',') this.position++
      else if (this.text[this.position] !== close) this.fail(`expected "," or "${close}"`)
    }
  }

  private key(): string {
    const char = this.text[this.position] as string
    if (char === "'" || char === '"') return this.string()
    const word = WORD.exec(this.text.slice(this.position))?.[0]
    if (!word) return this.fail('unexpected key')
    this.position += word.length
    return word
  }

  value(): Literal {
    this.skip()
    const char = this.text[this.position] as string
    if (char === "'" || char === '"' || char === '`') return this.string()
    if (char === '[') {
      const items: Literal[] = []
      this.list(']', () => items.push(this.value()))
      return items
    }
    if (char === '{') {
      const object: { [key: string]: Literal } = {}
      this.list('}', () => {
        const name = this.key()
        this.skip()
        if (this.text[this.position++] !== ':') this.fail('expected ":"')
        object[name] = this.value()
      })
      return object
    }
    const rest = this.text.slice(this.position)
    const number = NUMBER.exec(rest)?.[0]
    if (number) {
      this.position += number.length
      return Number(number)
    }
    const word = WORD.exec(rest)?.[0]
    const constants: Record<string, Literal> = { true: true, false: false, null: null }
    if (word && word in constants) {
      this.position += word.length
      return constants[word] as Literal
    }
    return this.fail(`unsupported expression near "${rest.slice(0, 24)}"`)
  }
}

export const parseLiteral = (text: string): Literal => new Reader(text).value()
