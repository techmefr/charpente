import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import { charpente } from 'charpente/vite'
import starlightThemeRapide from 'starlight-theme-rapide'

export default defineConfig({
  site: 'https://techmefr.github.io',
  base: '/charpente',
  trailingSlash: 'always',
  integrations: [
    starlight({
      components: { Search: './src/components/Search.astro' },
      title: 'charpente',
      description: 'Pure CSS skeleton loaders from a single configuration file: theme, motion and timing are three independent axes.',
      plugins: [starlightThemeRapide()],
      expressiveCode: { themes: ['dracula'] },
      favicon: '/favicon.svg',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/techmefr/charpente' }],
      customCss: ['virtual:charpente.css', './src/styles/custom.css', './src/styles/demo.css'],
      sidebar: [
        { label: 'Getting started', slug: 'getting-started' },
        { label: 'Themes', link: '/themes/' },
        { label: 'Motions and timing', slug: 'motions' },
        { label: 'Configuration', slug: 'configuration' },
        { label: 'Seasonal calendar', slug: 'calendar' },
        { label: 'Create a theme', slug: 'create-a-theme' },
        { label: 'Playground', link: '/playground/' },
        { label: 'Accessibility', slug: 'accessibility' },
      ],
    }),
  ],
  vite: { plugins: [charpente()] },
})
