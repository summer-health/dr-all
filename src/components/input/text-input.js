import { Button, TextField } from '@mui/material'
import { useState } from 'react'

export default function TextInput({ question, onNext }) {
  const [text, setText] = useState('')

  return (
    <>
      <p>{question.question}</p>
      <TextField
        onChange={(event) => {
          setText(event.target.value)
        }}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={!text || text.trim().length === 0}
        onClick={() => onNext(text)}
      >
        Next
      </Button>
    </>
  )
}
