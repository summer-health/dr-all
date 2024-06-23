'use client'

import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Select from '../../components/input/select'
import { useDebug } from '../../components/context/debug-context'
import { useDoctor } from '../../components/context/doctor-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function BuildDr() {
  const { logData } = useDebug()
  const { addQuestion } = useDoctor()
  const [prompt, setPrompt] = useState(undefined)
  const [system, setSystem] = useState(undefined)
  const [state, setState] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch('/doctor-prompt.txt')
        const data = await response.text()
        setPrompt(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    const fetchSystem = async () => {
      try {
        const response = await fetch('/doctor-system.txt')
        const data = await response.text()
        setSystem(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    fetchPrompt()
    fetchSystem()
  }, [])

  useEffect(() => {
    if (prompt && system) {
      // make POST call to /api/openai/completion
      const messages = [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ]
      const body = { messages, model: 'gpt-4' }
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
            const content = JSON.parse(
              data.chatCompletion.choices[0].message.content
            )

            logData({
              id: data.chatCompletion.id,
              data: content,
              message: 'Doctor prompt completion',
            })
            setState({ ...state, currentQuestion: content })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [prompt, system])

  const answerQuestion = (option) => {
    logData({ message: `Answered doctor prompt: ${option}` })
    const currentQuestion = state.currentQuestion
    setState({ ...state, currentQuestion: undefined })

    addQuestion({
      category: currentQuestion.category,
      question: currentQuestion.question,
      answer: option,
    })

    if (currentQuestion.remaining_categories?.length > 0) {
      setPrompt(
        `${prompt}\n\nCategory: ${currentQuestion.category}\nQuestion: ${currentQuestion.question}\nAnswer: ${option}`
      )
    } else {
      logData({ message: 'Finished doctor prompts' })
      router.push('/generate-dr')
    }
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%' }}
    >
      <Stack spacing={2} alignItems="center">
        <Avatar
          src={'/generic_avatar.png'}
          alt={'generic_avatar'}
          sx={{ width: 100, height: 100 }}
        />
        {state.currentQuestion && (
          <Select
            question={state.currentQuestion}
            onNext={(option) => {
              answerQuestion(option)
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
