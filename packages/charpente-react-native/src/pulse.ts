import { useEffect, useState } from 'react'
import { AccessibilityInfo, Animated } from 'react-native'

const PULSE_LOW = 0.5
const PULSE_DURATION = 700

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    let active = true
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduced(value)
    })
    return () => {
      active = false
    }
  }, [])
  return reduced
}

export const usePulse = (opacity: Animated.Value, active: boolean): void => {
  useEffect(() => {
    if (!active) return undefined
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: PULSE_LOW, duration: PULSE_DURATION, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: PULSE_DURATION, useNativeDriver: true }),
      ]),
    )
    loop.start()
    return () => {
      loop.stop()
      opacity.setValue(1)
    }
  }, [opacity, active])
}

export const useDelayed = (active: boolean, delay: number): boolean => {
  const [elapsed, setElapsed] = useState(false)
  useEffect(() => {
    if (!active || delay === 0) {
      setElapsed(false)
      return undefined
    }
    const timer = setTimeout(() => setElapsed(true), delay)
    return () => clearTimeout(timer)
  }, [active, delay])
  return active && (delay === 0 || elapsed)
}
