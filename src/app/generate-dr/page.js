'use client'

import { useDoctor } from '../../components/context/doctor-context'
import { useEffect, useState } from 'react'

export default function GenerateDr() {
  const { questions, setPersona } = useDoctor()
  const [personaDescription, setPersonaDescription] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [prompt, setPrompt] = useState('')

  useEffect(() => {
    if (questions.length > 0) {
      console.log('Questions collected for persona generation:', questions)
      fetchPrompt()
    } else {
      console.log('No questions found for persona generation.')
    }
  }, [questions])

  const fetchPrompt = async () => {
    try {
      const response = await fetch('/generate-dr-prompt.txt')
      const data = await response.text()
      setPrompt(data)
      generatePersona(data)
    } catch (error) {
      console.error('Error fetching the prompt file:', error)
    }
  }

  const generatePersona = (loadedPrompt) => {
    const responses = questions
      .map(
        (q) =>
          `Category: ${q.category}\nQuestion: ${q.question}\nAnswer: ${q.answer}`
      )
      .join('\n\n')
    const personaPrompt = loadedPrompt.replace('{{responses}}', responses)
    console.log('Persona Prompt:', personaPrompt)
    const messages = [
      { role: 'system', content: 'Create a detailed doctor persona' },
      { role: 'user', content: personaPrompt },
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
          const persona = data.chatCompletion.choices[0].message.content
          console.log('Generated Persona:', persona)
          setPersonaDescription(persona)
          setPersona(persona)
          generateAvatar(persona)
        } else {
          console.error('No content in chat completion response')
        }
      })
      .catch((error) => {
        console.error('Error generating persona:', error)
      })
  }

  const generateAvatar = (persona) => {
    const prompt = `Generate an image of a cartoon doctor that best reflects the following persona: ${persona}`
    console.log('Avatar Prompt:', prompt)
    const body = { prompt, size: '1024x1024' }
    fetch('/api/openai/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          console.log('Generated Avatar URL:', data.url)
          setAvatarUrl(data.url)
        } else {
          console.error('No URL in image generation response')
        }
      })
      .catch((error) => {
        console.error('Error generating avatar:', error)
      })
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Generated Doctor Persona</h2>
      {personaDescription ? (
        <>
          <pre>{personaDescription}</pre>
          {avatarUrl && (
            <div>
              <h3>Doctor Avatar</h3>
              <img
                src={avatarUrl}
                alt="Doctor Avatar"
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          )}
        </>
      ) : (
        <p>No persona generated yet.</p>
      )}
    </div>
  )
}
