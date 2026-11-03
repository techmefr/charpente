import type { ReactNode } from 'react'
import { Animated, Image as NativeImage, Pressable as NativePressable, Text as NativeText, View, type ImageProps, type PressableProps, type TextProps, type ViewProps, type ViewStyle } from 'react-native'
import { animatedOpacity, asViewStyle } from './casts'
import { useBones, type BoneState } from './context'
import { HIDDEN_CONTENT_A11Y, hiddenContentStyle } from './layout'

const boneStyle = (bones: BoneState): ViewStyle => ({
  backgroundColor: bones.color,
  borderRadius: bones.radius,
  opacity: animatedOpacity(bones.opacity),
})

export const Text = ({ style, ...props }: TextProps) => {
  const bones = useBones()
  if (!bones) return <NativeText style={style} {...props} />
  return (
    <Animated.Text
      {...props}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[style, boneStyle(bones), { color: 'transparent', textShadowColor: 'transparent' }]}
    />
  )
}

export const Image = ({ style, testID, onLayout, ...props }: ImageProps) => {
  const bones = useBones()
  if (!bones) return <NativeImage style={style} testID={testID} onLayout={onLayout} {...props} />
  return (
    <Animated.View
      testID={testID}
      onLayout={onLayout}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[asViewStyle(style), boneStyle(bones)]}
    />
  )
}

export interface BlockProps extends ViewProps {
  children?: ReactNode
}

export const Block = ({ style, children, ...props }: BlockProps) => {
  const bones = useBones()
  if (!bones) return <View style={style} {...props}>{children}</View>
  return (
    <Animated.View {...props} style={[style, boneStyle(bones)]}>
      <View {...HIDDEN_CONTENT_A11Y} style={hiddenContentStyle(style)}>{children}</View>
    </Animated.View>
  )
}

export const Pressable = ({ style, children, testID, onLayout, ...props }: PressableProps) => {
  const bones = useBones()
  if (!bones) return <NativePressable style={style} testID={testID} onLayout={onLayout} {...props}>{children}</NativePressable>
  const resolved = typeof style === 'function' ? style({ pressed: false }) : style
  return (
    <Animated.View testID={testID} onLayout={onLayout} style={[resolved, boneStyle(bones)]}>
      <View {...HIDDEN_CONTENT_A11Y} style={hiddenContentStyle(resolved)}>
        {typeof children === 'function' ? children({ pressed: false }) : children}
      </View>
    </Animated.View>
  )
}
