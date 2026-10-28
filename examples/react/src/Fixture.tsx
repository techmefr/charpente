import '../../../fixtures/page.css'
import complex from '../../../fixtures/complex.html?raw'
import simple from '../../../fixtures/simple.html?raw'

const pages = { simple, complex }

interface FixtureProps {
  page: keyof typeof pages
  loading: boolean
}

export function Fixture({ page, loading }: FixtureProps) {
  const html = pages[page]
  const markup = loading
    ? html.replace('data-testid="root"', 'data-testid="root" data-charpente-loading aria-busy="true" inert')
    : html

  return <div dangerouslySetInnerHTML={{ __html: markup }} />
}
