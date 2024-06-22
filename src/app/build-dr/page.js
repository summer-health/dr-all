'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import MultiSelect from '../../components/multi-select'

import { useState } from 'react'

const mockQuestion = {
  question: 'What are your favorite colors?',
  options: [
    'Red',
    'Green',
    'Blue',
    'Yellow',
    'Purple',
    'Orange',
    'Pink',
    'Black',
    'White',
  ],
}

export default function BuildDr() {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      <Stack spacing={2} alignItems="center">
        <FaceIcon style={{ fontSize: '100px' }} />
        <MultiSelect
          question={mockQuestion}
          onNext={(selectedOptions) => {
            alert('Works')
            console.log('selectedOptions', selectedOptions)
          }}
        />
      </Stack>
    </Stack>
  )
}
