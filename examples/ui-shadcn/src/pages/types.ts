import type { HTMLAttributes } from 'react'

export type RootProps = HTMLAttributes<HTMLElement> & { inert?: boolean }

export interface PageProps {
  rootProps: RootProps
}

export const GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
