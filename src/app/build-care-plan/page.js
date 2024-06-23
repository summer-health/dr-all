'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import Select from '../../components/input/select'
import { useDebug } from '../../components/context/debug-context'

import { useState, useEffect } from 'react'
import { useCarePlan } from '@/components/context/care-plan-context'

export default function BuildCarePlan() {
  const { logData } = useDebug()
  const { questions, addQuestion, setCarePlan } = useCarePlan()
  const [prompt, setPrompt] = useState(undefined)
  const [system, setSystem] = useState(undefined)
  const [state, setState] = useState([])

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch('/care-plan-prompt.txt')
        const data = await response.text()
        setPrompt(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    const fetchSystem = async () => {
      try {
        const response = await fetch('/care-plan-system.txt')
        const data = await response.text()
        setSystem(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    fetchPrompt()
    fetchSystem()
  }, [])

  const finalPrompt = async (answers) => {
    try {
      const response = await fetch('/care-plan-final-prompt.txt')
      const data = await response.text()
      const finalPrompt = `${data}\n\n${answers}`
      console.log('asking final prompt', finalPrompt)
      setPrompt(finalPrompt)
    } catch (error) {
      console.error('Error fetching the text file:', error)
    }
  }

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
              message: 'Care plan prompt completion',
            })
            if (Array.isArray(content)) {
              const contentWithUrl = content.map((c) => ({
                ...c,
                url:
                  '/api/openai/image?text=' +
                  encodeURIComponent(c.image_prompt),
              }))
              setCarePlan(contentWithUrl)
              // done
              console.log(contentWithUrl)
              alert('we are done')
            } else {
              setState({ ...state, currentQuestion: content })
            }
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [prompt, system])

  const answerQuestion = (option) => {
    logData({ message: `Answered care-plan prompt: ${option}` })
    const currentQuestion = state.currentQuestion
    setState({ ...state, currentQuestion: undefined })

    if (questions.length < 3) {
      addQuestion({
        question: currentQuestion.question,
        options: currentQuestion.options,
        answer: option,
      })
      setPrompt(
        `${prompt}\n\nQuestion: ${currentQuestion.question}\nAnswer: ${option}`
      )
    } else {
      // final question
      finalPrompt(
        questions
          .map(
            (q) =>
              `Question: ${q.question}\nOptions:${q.options.join('\n')}\nAnswer: ${q.answer}`
          )
          .join('\n\n')
      )
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
        <FaceIcon style={{ fontSize: '100px' }} />

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
