export type ShapeRole = 'body' | 'accent' | 'accent2' | 'detail' | 'shine'

export interface ShapeLayer {
  path: string
  name?: string
  role: ShapeRole
}

export interface ShapeDef {
  viewBox: [width: number, height: number]
  layers: ShapeLayer[]
  stretch?: boolean
}
