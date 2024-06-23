'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import { useState, useEffect } from 'react'
import Select from '../../components/input/select'
import { useDebug } from '../../components/context/debug-context'
import TextInput from '../../components/input/text-input'
import { useRouter } from 'next/navigation'
import { useDoctor } from '../../components/context/doctor-context'
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
  const { familyQuestions, addFamilyQuestion } = useFamily()
  const { persona } = useDoctor()
  const { logData } = useDebug()
  const [prompt, setPrompt] = useState(undefined)
  const [system, setSystem] = useState(undefined)
  const [state, setState] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const response = await fetch('/family-prompt.txt')
        const data = await response.text()
        setPrompt(data)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    const fetchSystem = async () => {
      try {
        const response = await fetch('/family-system.txt')
        const data = await response.text()
        setSystem(data.replace(/{persona}/g, JSON.stringify(persona, null, 2)))
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    if (!persona?.imageUrl) {
      logData({ message: 'No persona data found, going home' })
      router.push('/')
      return
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
              message: 'Family prompt completion',
            })
            setState({ ...state, currentQuestion: content })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }, [prompt, system])

  const answerQuestion = (answer) => {
    logData({ message: `Answered family prompt: ${answer}` })
    const currentQuestion = state.currentQuestion
    setState({ ...state, currentQuestion: undefined })

    addFamilyQuestion({
      question: currentQuestion.question,
      answer,
    })

    if (currentQuestion.continue) {
      setPrompt(
        `${prompt}\n\nQuestion: ${currentQuestion.question}\nAnswer: ${answer}`
      )
    } else {
      logData({ message: 'Finished family prompts', data: familyQuestions })
      // router.push('/generate-dr')
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
      <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
        <FaceIcon style={{ fontSize: '100px' }} />

        {/* If state.currentQuestion exists, choose component based on currentQuestion.inputType */}
        {state.currentQuestion && (
          <FamilyInput
            question={state.currentQuestion}
            onNext={(text) => {
              answerQuestion(text)
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
