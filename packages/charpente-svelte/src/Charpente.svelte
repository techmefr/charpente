<script lang="ts">
  import { loadingAttributes } from "charpente"
  import { untrack, type Snippet } from "svelte"

  interface Props {
    loading?: boolean
    tag?: string
    theme?: string
    motion?: string | string[]
    delay?: number
    stagger?: number
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
    if (now) {
      ready = false
      return
    }
    if (!before) return
    ready = true
    const timer = setTimeout(() => {
      ready = false
    }, untrack(() => revealMs))
    return () => clearTimeout(timer)
  })

  const computed = $derived(loadingAttributes({ loading, theme, motion, delay, stagger }))
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
  data-charpente-ready={ready ? "" : undefined}
  style={inline}
>
  {@render children?.()}
</svelte:element>
{#if label}
  <span
    role="status"
    style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"
  >{loading ? label : ""}</span>
{/if}
