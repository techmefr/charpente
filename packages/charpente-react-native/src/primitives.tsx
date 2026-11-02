import type { ReactNode } from 'react'
import { Animated, Image as NativeImage, Pressable as NativePressable, Text as NativeText, View, type ImageProps, type PressableProps, type StyleProp, type TextProps, type ViewProps, type ViewStyle } from 'react-native'
import { useBones, type BoneState } from './context'

const boneStyle = (bones: BoneState): ViewStyle => ({
  backgroundColor: bones.color,
  borderRadius: bones.radius,
  opacity: bones.opacity as unknown as number,
})

const HIDDEN: ViewStyle = { opacity: 0 }

export const Text = ({ style, ...props }: TextProps) => {
  const bones = useBones()
  if (!bones) return <NativeText style={style} {...props} />
  return <Animated.Text {...props} style={[style, boneStyle(bones), { color: 'transparent', textShadowColor: 'transparent' }]} />
}

export const Image = ({ style, ...props }: ImageProps) => {
  const bones = useBones()
  if (!bones) return <NativeImage style={style} {...props} />
  return <Animated.View style={[style as StyleProp<ViewStyle>, boneStyle(bones)]} />
}

export interface BlockProps extends ViewProps {
  children?: ReactNode
}

export const Block = ({ style, children, ...props }: BlockProps) => {
  const bones = useBones()
  if (!bones) return <View style={style} {...props}>{children}</View>
  return (
    <Animated.View {...props} style={[style, boneStyle(bones)]}>
      <View style={HIDDEN}>{children}</View>
    </Animated.View>
  )
}

export const Pressable = ({ style, children, ...props }: PressableProps) => {
  const bones = useBones()
  if (!bones) return <NativePressable style={style} {...props}>{children}</NativePressable>
  const resolved = typeof style === 'function' ? style({ pressed: false }) : style
  return (
    <Animated.View style={[resolved, boneStyle(bones)]}>
      <View style={HIDDEN}>{typeof children === 'function' ? children({ pressed: false }) : children}</View>
    </Animated.View>
  )
}
