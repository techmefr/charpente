export const loadingProps = (loading: boolean): Record<string, unknown> =>
  loading ? { 'data-charpente-loading': '', 'aria-busy': 'true', inert: true } : {}
