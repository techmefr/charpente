import type { Animated, ImageStyle, StyleProp, ViewStyle } from 'react-native'

export const animatedOpacity = (value: Animated.Value): number => value as unknown as number

export const asViewStyle = (style: StyleProp<ImageStyle>): StyleProp<ViewStyle> => style as StyleProp<ViewStyle>
