'use client'

import FaceIcon from '@mui/icons-material/Face'
import Stack from '@mui/material/Stack'
import { useState, useEffect } from 'react'
import Select from '../../components/input/select'
import { useDebug } from '../../components/context/debug-context'
import TextInput from '../../components/input/text-input'
import { useRouter } from 'next/navigation'

const persona = {
  Name: 'Dr. Emma Washington',
  'Job Title': 'Pediatrician',
  Description:
    "Dr. Emma Washington is a attentive and responsible pediatrician known for her supportive and kind approach towards her patients. Her personality umbrages a comforting and secure aura making the child feel at home. Dr. Washington's casual yet professional way of working, builds a trustworthy environment. Best known for her friendly demeanor, Dr. Washington's patience and ability to attentively listen makes her an epitome of empathy. Her sense of humor is quite popular among her young patients ensuring an easy and calm atmosphere during the visits.",
  'Doctor Introduction':
    "Hello there, I'm Dr. Emma Washington, your child's friendly doctor. I'm here to ensure your child's health and happiness with my heartwarming care and comic timings. Be assured, you and your child's worries are my priority.",
  Friendliness: 'Very friendly and warm presence',
  Empathy: 'Highly understanding and a great listener',
  Funniness: 'Easily breaks out light-hearted jokes',
  Professionalism: 'Professional yet casual approach',
  'Communication Style':
    'Smooth communication in simplified medical terminology',
  Gender: 'Female',
  Ethnicity: 'Caucasian',
  Appearance:
    'Dr. Washington has blonde hair up to her shoulders, wears spectacles and often smiles warmly during conversations.',
  'Image Url':
    'blob:http://localhost:3000/b0c73dfb-bb20-4a93-b328-c85212108b49',
}

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

    if (currentQuestion.continue) {
      setPrompt(
        `${prompt}\n\nQuestion: ${currentQuestion.question}\nAnswer: ${answer}`
      )
    } else {
      logData({ message: 'Finished family prompts' })
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
