import { solid } from './themes/builtin/core'
import { createCompiler } from './stylesheet'
import { createNativeTheme } from './themes'

export { defineCharpente, defineTheme } from './define'
export type { NativeColors, NativeTheme } from './themes'
export type * from './types'

export const compile = createCompiler({ solid }, true)

export const nativeTheme = createNativeTheme({ solid }, true)
