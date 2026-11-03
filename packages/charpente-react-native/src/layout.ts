import { StyleSheet, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

export const HIDDEN_CONTENT_A11Y: ViewProps = {
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
}

export const hiddenContentStyle = (style: StyleProp<ViewStyle>): ViewStyle => {
  const { flexDirection, flexWrap, alignItems, alignContent, justifyContent, gap, rowGap, columnGap } = StyleSheet.flatten(style) ?? {}
  return { opacity: 0, flexDirection, flexWrap, alignItems, alignContent, justifyContent, gap, rowGap, columnGap }
}
