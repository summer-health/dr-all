import Link from 'next/link'

export default function Home() {
  return (
    <p>
      This container has a 9:16 aspect ratio, simulating a mobile device screen.
      This is the welcome placeholder
      <Link href="/build-dr"> Build Dr. </Link>
    </p>
  )
}
