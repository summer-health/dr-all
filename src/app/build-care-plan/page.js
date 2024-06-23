'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import Select from '../../components/input/select'
import Avatar from '@mui/material/Avatar'
import { useDebug } from '../../components/context/debug-context'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useCarePlan } from '@/components/context/care-plan-context'
import { useDoctor } from '@/components/context/doctor-context'
import { useFamily } from '@/components/context/family-context'

const MAX_QUESTIONS = 3

export default function BuildCarePlan() {
  const { logData } = useDebug()
  const { questions, addQuestion, setCarePlan } = useCarePlan()
  const { persona } = useDoctor()
  const { family } = useFamily()
  const [prompt, setPrompt] = useState(undefined)
  const [system, setSystem] = useState(undefined)
  const [state, setState] = useState([])
  const router = useRouter()

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
        let systemPrompt = await response.text()

        const personaText = Object.entries(persona).reduce(
          (acc, [key, value]) => {
            if (key === 'doctorAvatar') return acc
            return `${acc}\n- ${key}: ${value}`
          },
          ''
        )
        console.log('doctor', personaText)
        systemPrompt = systemPrompt.replace('{doctorPersona}', personaText)

        console.log('family', family.summary)
        systemPrompt = systemPrompt.replace('{family}', family.summary)

        setSystem(systemPrompt)
      } catch (error) {
        console.error('Error fetching the text file:', error)
      }
    }

    if (!persona?.imageUrl || !family?.summary) {
      logData({ message: 'No persona or family data found, going home' })
      router.push('/')
      return
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
      const body = { messages, model: 'gpt-4o' }
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
              const plan = content.sort(
                (a, b) => b.date_to_complete - a.date_to_complete
              )
              setCarePlan(plan)
              // done
              console.log(plan)
              router.push('/care-plan')
            } else {
              setState({ ...state, currentQuestion: content })
            }
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert(error)
        })
    }
  }, [prompt, system])

  const answerQuestion = (option) => {
    logData({ message: `Answered care-plan prompt: ${option}` })
    const currentQuestion = state.currentQuestion
    setState({ ...state, currentQuestion: undefined })

    if (questions.length < MAX_QUESTIONS) {
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
      router.push('/generate-care-plan')
      // finalPrompt(
      //   questions
      //     .map(
      //       (q) =>
      //         `Question: ${q.question}\nOptions:${q.options.join('\n')}\nAnswer: ${q.answer}`
      //     )
      //     .join('\n\n')
      // )
    }
  }

  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="start"
      justifyContent="center"
      sx={{ width: '100%', padding: 2, height: '100%', paddingTop: 10 }}
    >
      <Stack spacing={2} alignItems="center">
        {persona && persona.Name && persona.doctorAvatar ? (
          <Avatar
            src={persona.doctorAvatar}
            alt={persona.Name}
            sx={{ width: 100, height: 100 }}
          />
        ) : (
          <Avatar sx={{ width: 100, height: 100 }}>
            <FaceIcon style={{ fontSize: 60 }} />
          </Avatar>
        )}

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
