'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
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

function MultiSelectChips({ options, selectedOptions, onToggle }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      justifyContent="center"
    >
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          onClick={() => onToggle(option)}
          color={selectedOptions.includes(option) ? 'primary' : 'default'}
          variant={selectedOptions.includes(option) ? 'filled' : 'outlined'}
        />
      ))}
    </Stack>
  )
}

function MultiSelect({ onNext }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleToggle = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    )
  }

  const question = mockQuestion

  return (
    <>
      <p>{question.question}</p>
      <MultiSelectChips
        options={question.options}
        selectedOptions={selectedOptions}
        onToggle={handleToggle}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={selectedOptions.length === 0}
        onClick={onNext}
      >
        Next
      </Button>
    </>
  )
}

export default function BuildDr() {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      <Stack spacing={2} alignItems="center">
        <FaceIcon style={{ fontSize: '100px' }} />
        <MultiSelect
          onNext={() => {
            alert('Works')
          }}
        />
      </Stack>
    </Stack>
  )
}
