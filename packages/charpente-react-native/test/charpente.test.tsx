// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { ViewStyle } from 'react-native'
import { cyberpunk } from 'charpente/themes'
import { Block, Charpente, Image, Pressable, Text } from '../src'
import { native } from './native-mock'

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

let host: HTMLElement
let root: Root | undefined

const render = async (tree: React.ReactNode) => {
  await act(async () => {
    root ??= createRoot(host)
    root.render(tree)
  })
}

const unmount = async () => {
  await act(async () => root?.unmount())
  root = undefined
}

const byId = (id: string): HTMLElement => {
  const element = host.querySelector<HTMLElement>(`[data-test-id='${id}']`)
  if (!element) throw new Error(`missing ${id}`)
  return element
}

const parseStyle = (element: HTMLElement): Record<string, unknown> => JSON.parse(element.getAttribute('data-style') ?? '{}')

const styleOf = (id: string) => parseStyle(byId(id))

const wrapperOf = (id: string): HTMLElement => {
  const wrapper = byId(id).parentElement
  if (!wrapper) throw new Error(`no wrapper for ${id}`)
  return wrapper
}

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  native.reset()
  host = document.createElement('div')
  document.body.appendChild(host)
})

afterEach(async () => {
  vi.useRealTimers()
  await unmount()
  host.remove()
})

describe('Charpente', () => {
  it('leaves the content untouched when nothing is loading', async () => {
    await render(
      <Charpente>
        <Text testID="text" style={{ color: 'red' }}>Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toEqual({ color: 'red' })
    expect(host.textContent).toBe('Hello')
  })

  it('paints text with the theme color and hides the glyphs while loading', async () => {
    await render(
      <Charpente loading theme="solid" dark={false}>
        <Text testID="text" style={{ fontSize: 16 }}>Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ fontSize: 16, color: 'transparent', backgroundColor: '#e5e7eb', borderRadius: 6, opacity: 1 })
  })

  it('uses the dark palette of the default theme', async () => {
    await render(
      <Charpente loading dark>
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#2a2d34' })
  })

  it('follows the system color scheme and lets the dark prop override it', async () => {
    native.scheme = 'dark'
    await render(
      <Charpente loading>
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#2a2d34' })
    await render(
      <Charpente loading dark={false}>
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#e5e7eb' })
  })

  it('uses the colors and the radius of a custom theme', async () => {
    await render(
      <Charpente loading dark={false} themes={{ ocean: { colors: ['#112233', '#445566'], pattern: 'solid', radius: '12px' } }} theme="ocean">
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#112233', borderRadius: 12 })
  })

  it('takes a theme object imported from charpente/themes', async () => {
    await render(
      <Charpente loading dark={false} theme={cyberpunk}>
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#0b1426', borderRadius: 3 })
  })

  it('resolves a themes entry that is an imported theme object by name', async () => {
    await render(
      <Charpente loading dark={false} themes={{ cyberpunk }} theme="cyberpunk">
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(styleOf('text')).toMatchObject({ backgroundColor: '#0b1426' })
  })

  it('replaces images with a painted view and hides the content of blocks and pressables', async () => {
    await render(
      <Charpente loading dark={false}>
        <Image testID="image" source={{ uri: 'x' }} style={{ width: 40, height: 40 }} />
        <Block testID="block" style={{ height: 20 }}>
          <Text testID="inside">Inside</Text>
        </Block>
        <Pressable testID="pressable" style={{ padding: 8 }}>
          <Text testID="go">Go</Text>
        </Pressable>
      </Charpente>,
    )
    expect(host.querySelector('img')).toBeNull()
    expect(host.querySelector('button')).toBeNull()
    expect(host.querySelectorAll("[data-style*='#e5e7eb']")).toHaveLength(5)
    for (const id of ['image', 'block', 'pressable', 'inside', 'go']) {
      expect(styleOf(id)).toMatchObject({ backgroundColor: '#e5e7eb' })
    }
    expect(styleOf('image')).toMatchObject({ width: 40, height: 40 })
  })

  it('hides the masked content and the bones from assistive technologies', async () => {
    await render(
      <Charpente loading>
        <Image testID="image" source={{ uri: 'x' }} />
        <Text testID="text">Hello</Text>
        <Block testID="block">
          <Text testID="inside">Inside</Text>
        </Block>
        <Pressable testID="pressable">
          <Text testID="go">Go</Text>
        </Pressable>
      </Charpente>,
    )
    for (const id of ['image', 'text', 'inside', 'go']) {
      expect(byId(id).getAttribute('data-a11y-hidden')).toBe('true')
      expect(byId(id).getAttribute('data-important')).toBe('no')
    }
    for (const id of ['inside', 'go']) {
      const wrapper = wrapperOf(id)
      expect(wrapper.getAttribute('data-a11y-hidden')).toBe('true')
      expect(wrapper.getAttribute('data-important')).toBe('no-hide-descendants')
      expect(parseStyle(wrapper)).toMatchObject({ opacity: 0 })
    }
  })

  it('keeps the row layout of blocks and pressables on the masked wrapper', async () => {
    const layout: ViewStyle = { flexDirection: 'row', gap: 8, alignItems: 'center' }
    await render(
      <Charpente loading>
        <Block style={layout}>
          <Text testID="inside">Inside</Text>
        </Block>
        <Pressable style={() => layout}>
          <Text testID="go">Go</Text>
        </Pressable>
      </Charpente>,
    )
    for (const id of ['inside', 'go']) {
      expect(parseStyle(wrapperOf(id))).toMatchObject({ ...layout, opacity: 0 })
    }
  })

  it('renders pressables with a style function and children function', async () => {
    await render(
      <Charpente loading dark={false}>
        <Pressable testID="pressable" style={({ pressed }) => ({ padding: pressed ? 1 : 8 })}>
          {({ pressed }) => <Text testID="label">{pressed ? 'down' : 'up'}</Text>}
        </Pressable>
      </Charpente>,
    )
    expect(styleOf('pressable')).toMatchObject({ padding: 8, backgroundColor: '#e5e7eb' })
    expect(byId('label').textContent).toBe('up')
  })

  it('forwards testID and onLayout from image and pressable bones', async () => {
    await render(
      <Charpente loading>
        <Image testID="image" source={{ uri: 'x' }} onLayout={() => undefined} />
        <Pressable testID="pressable" onLayout={() => undefined} />
      </Charpente>,
    )
    expect(byId('image').getAttribute('data-layout')).toBe('true')
    expect(byId('pressable').getAttribute('data-layout')).toBe('true')
  })

  it('marks the container busy and blocks touches while loading', async () => {
    await render(
      <Charpente loading testID="container">
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(byId('container').getAttribute('data-busy')).toBe('true')
    expect(byId('container').getAttribute('data-pointer')).toBe('none')
  })

  it('waits for the delay before showing the skeleton', async () => {
    vi.useFakeTimers()
    await render(
      <Charpente loading delay={5000} testID="container">
        <Text testID="text">Hello</Text>
      </Charpente>,
    )
    expect(byId('container').getAttribute('data-busy')).toBe('false')
    expect(styleOf('text')).toEqual({})
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })
    expect(byId('container').getAttribute('data-busy')).toBe('true')
    expect(styleOf('text')).toMatchObject({ color: 'transparent' })
  })
})

describe('pulse', () => {
  it('starts the loop while loading and stops it on unmount', async () => {
    await render(
      <Charpente loading>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.loopStart).toHaveBeenCalledTimes(1)
    expect(native.loopStop).not.toHaveBeenCalled()
    await unmount()
    expect(native.loopStop).toHaveBeenCalledTimes(1)
  })

  it('stops the loop and restores the opacity when loading ends', async () => {
    await render(
      <Charpente loading>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.values[0]?.value).toBe(0.5)
    await render(
      <Charpente loading={false}>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.loopStop).toHaveBeenCalledTimes(1)
    expect(native.values[0]?.value).toBe(1)
  })

  it('does not animate with motion none', async () => {
    await render(
      <Charpente loading motion="none">
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.loop).not.toHaveBeenCalled()
  })

  it('does not animate when reduced motion is enabled', async () => {
    native.reduceMotion = true
    await render(
      <Charpente loading>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.loopStop).toHaveBeenCalledTimes(1)
    expect(native.values[0]?.value).toBe(1)
  })

  it('reacts to reduced motion changes and unsubscribes on unmount', async () => {
    await render(
      <Charpente loading>
        <Text>Hello</Text>
      </Charpente>,
    )
    expect(native.loopStart).toHaveBeenCalledTimes(1)
    await act(async () => native.listeners.forEach((listener) => listener(true)))
    expect(native.loopStop).toHaveBeenCalledTimes(1)
    await unmount()
    expect(native.removeListener).toHaveBeenCalledTimes(1)
  })
})
