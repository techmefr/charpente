# charpente

Skeleton loaders en CSS pur : le thème, la motion et le timing sont trois axes indépendants, configurés dans un seul `charpente.config.ts`. Aucun JS au runtime.

## Paquets

- `packages/charpente` : compilateur config vers CSS et plugin Vite (`charpente/vite`)
- `packages/charpente-vue` : wrapper `<Charpente :loading>`
- `demo` : page de démo avec bascule en direct du thème, de la motion, du timing et du mode sombre

## Utilisation

```ts
// charpente.config.ts
import { defineCharpente } from 'charpente'

export default defineCharpente({
  theme: 'cyberpunk',
  motion: ['shimmer', 'glitch'],
  timing: { delay: 120, stagger: 40 },
  colorScheme: { dark: '[data-theme="dark"]' },
})
```

```ts
// vite.config.ts
import { charpente } from 'charpente/vite'

export default { plugins: [charpente()] }
```

```ts
import 'virtual:charpente.css'
```

```vue
<Charpente :loading="pending" motion="none">
  <UserCard :user="user ?? placeholder" />
</Charpente>
```

Thèmes : `solid`, `outline`, `dots`, `cyberpunk`, `web`. Motions : `shimmer`, `pulse`, `wave`, `glitch`.

## Développement

```bash
pnpm install
pnpm build
pnpm test
pnpm demo
```
