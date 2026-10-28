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
  defaultTheme: 'cyberpunk',
  motion: ['shimmer', 'glitch'],
  timing: { delay: 120, stagger: 40 },
  colorScheme: { dark: '[data-theme="dark"]' },
  timeZone: 'Europe/Paris',
  schedule: [
    { theme: 'web', from: '10-15', to: '11-02' },
    { theme: 'dots', from: '12-01', to: '12-31' },
  ],
})
```

Le premier créneau qui correspond à la date gagne, sinon `defaultTheme` s'applique. Les dates sont lues dans `timeZone`.

```ts
import { activeTheme } from 'virtual:charpente.theme'

const theme = activeTheme()
```

En ligne de commande : `charpente theme --date 2026-10-31`.

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

Thèmes : `solid`, `outline`, `dots`, `cyberpunk`, `web`, `paper`, `glass`, `blueprint`, `halloween`, `noel`, `nouvel-an`, `hiver`, `ete`, `printemps`, `automne`. Motions : `shimmer`, `pulse`, `wave`, `glitch`.

`schedule: schedulePresets.all` (import depuis `charpente`) applique les fêtes puis les saisons ; `celebrations` et `seasons` existent séparément.

`include: ['dots', 'noel']` ne livre que ces thèmes, plus le thème par défaut, ceux du calendrier et les vôtres.

Un thème peut définir `dark: { ... }` pour ses tokens en mode sombre, et `colorScheme.light` (ex. `'[data-theme="light"]'`) force le clair dans un sous-arbre.

## Développement

```bash
pnpm install
pnpm build
pnpm test
pnpm demo
```
