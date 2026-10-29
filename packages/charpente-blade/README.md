<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/logo-dark.svg">
    <img src="https://raw.githubusercontent.com/techmefr/charpente/main/site/public/brand/logo-light.svg" alt="charpente" width="64" height="64">
  </picture>
</p>

# charpente for Blade

Copy-paste stub, no Composer package. Requires the charpente CSS and Laravel 10+.

1. Copy `charpente.blade.php` to `resources/views/components/charpente.blade.php`.
2. Wrap the content to skeletonize:

```blade
<x-charpente :loading="$loading" tag="main" theme="soft" :motion="['shimmer']" label="Loading" class="page">
  ...
</x-charpente>
```

Props: loading, tag (default div), theme, motion (string or array), delay (ms), stagger (ms), label (screen-reader text shown while loading).
Other attributes (class, data-testid, wire:key) go to the root element.
Never write data-charpente-* by hand.
