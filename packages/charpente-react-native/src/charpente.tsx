import { nativeTheme, type ThemeDef } from 'charpente'
import { useMemo, useRef, type ReactNode } from 'react'
import { Animated, View, useColorScheme, type ViewProps } from 'react-native'
import { CharpenteContext } from './context'
import { useDelayed, usePulse, useReducedMotion } from './pulse'

export interface CharpenteProps extends ViewProps {
  loading?: boolean
  theme?: string
  themes?: Record<string, ThemeDef>
  motion?: 'pulse' | 'none'
  dark?: boolean
  delay?: number
  children?: ReactNode
}

export const Charpente = ({
  loading = false,
  theme = 'solid',
  themes,
  motion = 'pulse',
  dark,
  delay = 0,
  children,
  ...rest
}: CharpenteProps) => {
  const scheme = useColorScheme()
  const reducedMotion = useReducedMotion()
  const shown = useDelayed(loading, delay)
  const opacity = useRef(new Animated.Value(1)).current
  const palette = useMemo(() => nativeTheme(theme, themes), [theme, themes])
  const color = (dark ?? scheme === 'dark') ? palette.dark.base : palette.light.base
  usePulse(opacity, shown && motion === 'pulse' && !reducedMotion)
  const state = useMemo(() => ({ loading: shown, color, radius: palette.radius, opacity }), [shown, color, palette.radius, opacity])

  return (
    <CharpenteContext.Provider value={state}>
      <View {...rest} accessibilityState={{ busy: shown }} pointerEvents={shown ? 'none' : rest.pointerEvents}>
        {children}
      </View>
    </CharpenteContext.Provider>
  )
}
