# charpente-react-native

React Native wrapper for [charpente](https://github.com/techmefr/charpente). It reads the colors and radius of your charpente theme and paints skeleton shapes with views, since React Native has no CSS.

```bash
pnpm add charpente charpente-react-native
```

```tsx
import { Block, Charpente, Image, Pressable, Text } from "charpente-react-native"

<Charpente loading={pending} theme="solid">
  <Image source={{ uri }} style={{ width: 64, height: 64 }} />
  <Text>{name}</Text>
  <Pressable onPress={follow}><Text>Follow</Text></Pressable>
</Charpente>
```

Use the `Text`, `Image`, `Pressable` and `Block` of this package in the area. While `loading` is on, text is painted behind transparent glyphs, images become painted views, and pressables and blocks hide their content. Anything else is left as it is.

Props of `Charpente`: `loading`, `theme`, `themes` (custom theme definitions), `motion` (`pulse` or `none`), `dark` (defaults to the system scheme), `delay` in ms. The container is marked busy for accessibility and ignores touches while loading. The pulse stops when the system asks for reduced motion.

Not supported on native: patterns, gradients, image borders and the shimmer band. Colors, radius and the pulse follow the theme.

## License

MIT
