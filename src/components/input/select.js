import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

export default function Select({ question, onNext }) {
  if (!question || !question.question || !question.options) {
    return (
      <>
        <p>Invalid question:</p>
        <pre>{JSON.stringify(question, null, 2)}</pre>
      </>
    )
  }

  return (
    <>
      <p>{question.question}</p>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        justifyContent="center"
      >
        {question.options.map((option) => (
          <Chip key={option} label={option} onClick={() => onNext(option)} />
        ))}
      </Stack>
    </>
  )
}
