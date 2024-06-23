import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import { useState } from 'react'

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

export default function MultiSelect({ question, onNext }) {
  const [selectedOptions, setSelectedOptions] = useState([])

  const handleToggle = (option) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    )
  }

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
        onClick={() => onNext(selectedOptions)}
      >
        Next
      </Button>
    </>
  )
}
