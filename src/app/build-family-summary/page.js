'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import { CircularProgress } from '@mui/material'
import { useState, useEffect } from 'react'
import Select from '../../components/input/select'
import { useDebug } from '../../components/context/debug-context'
import TextInput from '../../components/input/text-input'
import { useRouter } from 'next/navigation'

import { useFamily } from '../../components/context/family-context'

function FamilyInput({ question, onNext }) {
  if (question.inputType === 'TEXT') {
    return <TextInput question={question} onNext={onNext} />
  }

  if (question.inputType === 'SELECT') {
    return <Select question={question} onNext={onNext} />
  }

  return <>Unsupported input type</>
}

export default function BuildFamily() {
  const { familyQuestions, setFamily, family } = useFamily()
  const [loading, isLoading] = useState(true)

  const { logData } = useDebug()
  const [prompt, setPrompt] = useState(undefined)

  const router = useRouter()

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch('/family-summary-prompt.txt')
        const data = await response.text()

        const questions = familyQuestions
          .map(
            (question) =>
              `Question: ${question.question}\nAnswer: ${question.answer}`
          )
          .join('\n\n')

        setPrompt(`${data}\n\n${questions}`)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    if (!familyQuestions || familyQuestions.length === 0) {
      logData({ message: 'No family questions, going home' })
      router.push('/')
      return
    }

    fetchPrompt()
  }, [])

  useEffect(() => {
    if (prompt) {
      // make POST call to /api/openai/completion
      const messages = [{ role: 'user', content: prompt }]
      const body = { messages, model: 'gpt-3.5-turbo' }
      fetch('/api/openai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.chatCompletion?.choices?.[0]?.message?.content) {
            const content = data.chatCompletion.choices[0].message.content

            logData({
              id: data.chatCompletion.id,
              data: { summary: content },
              message: 'Family summary completion',
            })
            setFamily({ summary: content })
            router.push('/build-care-plan')
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [prompt])

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="start"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%', paddingTop: 10 }}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <CircularProgress />
      </Stack>
    </Stack>
  )
}
