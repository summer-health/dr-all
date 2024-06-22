'use client'

import Link from 'next/link'
import Chip from '@mui/material/Chip'

export default function Home() {
  return (
    <>
      <p>This is the welcome placeholder</p>
      <Link href="/build-dr">
        <Chip label="Build Doctor" />
      </Link>
    </>
  )
}
