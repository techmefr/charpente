export type ShapeRole = 'body' | 'accent' | 'accent2' | 'detail' | 'shine'

export type ShapeGradient = 'x' | 'y' | 'd'

export interface ShapeLayer {
  path: string
  name?: string
  role: ShapeRole
  gradient?: ShapeGradient
  opacity?: number
}

export interface FixedShape {
  viewBox: [width: number, height: number]
  layers: ShapeLayer[]
  size: string
}

export interface ShapeDef {
  viewBox: [width: number, height: number]
  layers: ShapeLayer[]
  stretch?: boolean
  fixed?: FixedShape
}
