import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ url }) => ({
  loading: url.searchParams.get("state") === "loading",
})
