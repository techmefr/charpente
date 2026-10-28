import Link from "next/link"

export default function Home() {
  return (
    <main>
      <Link href="/simple">simple</Link> <Link href="/complex">complex</Link>
    </main>
  )
}
