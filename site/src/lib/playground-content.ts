import { palette } from './palette'

export const motions = [
  { name: 'shimmer', checked: true },
  { name: 'pulse', checked: false },
  { name: 'glitch', checked: false },
  { name: 'rebond', checked: false },
]

export const kpis = [
  { label: 'Revenue', value: '$48,210', icon: 'circle' },
  { label: 'Orders', value: '1,204', icon: 'square' },
  { label: 'Average basket', value: '$40.05', icon: 'triangle' },
]

export const orders = [
  ['1001', 'Lumière Workshop', '$1,240.00', 'Paid'],
  ['1002', 'Verdier House', '$389.90', 'Pending'],
  ['1003', 'Peony Studio', '$2,075.50', 'Paid'],
  ['1004', 'Harbor Café', '$96.00', 'Refunded'],
]

export const products = [
  { name: 'Spiral notebook', note: 'Recycled paper', from: palette.amber, to: palette.red },
  { name: 'Blue fountain pen', note: 'Fine nib', from: palette.sky, to: palette.indigo },
  { name: 'Desk lamp', note: 'Warm LED', from: palette.emerald, to: palette.ocean },
]
