import { Charpente } from 'charpente-solid'
import '../../../fixtures/page.css'
import complex from '../../../fixtures/complex.html?raw'
import simple from '../../../fixtures/simple.html?raw'

const pages = { simple, complex }

interface FixtureProps {
  page: keyof typeof pages
  loading: boolean
}

export function Fixture(props: FixtureProps) {
  const template = document.createElement('template')
  template.innerHTML = pages[props.page].trim()
  const source = template.content.firstElementChild as HTMLElement

  return (
    <Charpente
      tag={source.tagName.toLowerCase()}
      class={source.className}
      data-testid="root"
      loading={props.loading}
      innerHTML={source.innerHTML}
    />
  )
}
