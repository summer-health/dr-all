'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import Fade from '@mui/material/Fade'
import { useState, useEffect } from 'react'
import Select from '../../components/input/select'

const mockQuestion = {
  question: 'Who is your favorite?',
  options: ['Matthew', 'Mimu', 'Rachel', 'Jose'],
}

export default function BuildFamily() {
  const [questionLoading, setQuestionLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      // Artificial delay
      setQuestionLoading(false)
    }, 1000)
  }, [])

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <FaceIcon style={{ fontSize: '100px' }} />

        <Fade in={!questionLoading}>
          <div>
            <Select
              question={mockQuestion}
              onNext={(selectedOptions) => {
                setQuestionLoading(true)
                setTimeout(() => {
                  setQuestionLoading(false)
                }, 1000)
              }}
            />
          </div>
        </Fade>
      </Stack>
    </Stack>
  )
}
