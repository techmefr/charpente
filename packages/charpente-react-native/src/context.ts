import { createContext, useContext } from 'react'
import type { Animated } from 'react-native'

export interface BoneState {
  loading: boolean
  color: string
  radius: number
  opacity: Animated.Value
}

export const CharpenteContext = createContext<BoneState | undefined>(undefined)

export const useBones = (): BoneState | undefined => {
  const state = useContext(CharpenteContext)
  return state?.loading ? state : undefined
}
