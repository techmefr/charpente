<script lang="ts">
  import { loadingAttributes, revealWindow, type LoadingScope } from "charpente"
  import { configuredScope, setLoading } from "charpente/dom"
  import { onMount, untrack, type Snippet } from "svelte"

  interface Props {
    loading?: boolean
    tag?: string
    theme?: string
    motion?: string | string[]
    delay?: number
    stagger?: number
    reveal?: number
    scope?: LoadingScope
    label?: string
    revealMs?: number
    style?: string
    children?: Snippet
    [attribute: string]: unknown
  }

  let {
    loading = false,
    tag = "div",
    theme,
    motion,
    delay,
    stagger,
    reveal,
    scope,
    label = "",
    revealMs = 260,
    style,
    children,
    ...rest
  }: Props = $props()

  let ready = $state(false)
  let wasLoading = loading

  $effect(() => {
    const now = loading
    const before = untrack(() => wasLoading)
    wasLoading = now
    if (!before || now) return
    ready = true
    const timer = setTimeout(() => {
      ready = false
    }, untrack(() => revealWindow(revealMs, reveal)))
    return () => clearTimeout(timer)
  })

  let element: HTMLElement | undefined = $state()
  let page = $state(untrack(() => scope === "page"))

  onMount(() => {
    if (scope === undefined && element) page = configuredScope(element) === "page"
  })

  $effect(() => {
    if (scope !== undefined) page = scope === "page"
  })

  $effect(() => {
    const target = element
    if (!page || !target) return
    setLoading(target, { loading, theme, motion, delay, stagger, reveal, ready, scope: "page" })
    return () => setLoading(target, { loading: false, scope: "page" })
  })

  const computed = $derived(
    loadingAttributes(page ? { loading: false } : { loading, theme, motion, delay, stagger, reveal }),
  )
  const inline = $derived(
    [style, ...Object.entries(computed.style).map(([name, value]) => `${name}:${value}`)]
      .filter(Boolean)
      .join(";") || undefined,
  )
  const attributes = $derived.by(() => {
    const { inert, ...others } = computed.attributes
    return { ...others, inert: inert !== undefined }
  })
</script>

<svelte:element
  this={tag}
  {...rest}
  {...attributes}
  bind:this={element}
  data-charpente-ready={ready && !page ? "" : undefined}
  style={inline}
>
  {@render children?.()}
</svelte:element>
{#if loading && label}
  <span
    role="status"
    style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"
  >{label}</span>
{/if}
