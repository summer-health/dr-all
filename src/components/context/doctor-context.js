// Create a react context for storing a debug log of data submittable by downstream components.
'use client'

import { useEffect } from 'react'
import { load, store } from '@/libs/localStorage'
import { createContext, useContext, useState } from 'react'

const DoctorContext = createContext()

export function DoctorProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [persona, setPersona] = useState(load('doctorPersona'))

  const addQuestion = (question) => {
    setQuestions((prevQuestions) => [...prevQuestions, question])
  }

  useEffect(() => {
    if (persona) {
      store('doctorPersona', persona)
    }
  }, [persona])

  return (
    <DoctorContext.Provider
      value={{ questions, addQuestion, persona, setPersona }}
    >
      {children}
    </DoctorContext.Provider>
  )
}

export function useDoctor() {
  const context = useContext(DoctorContext)
  if (!context) {
    throw new Error('useDoctor must be used within a DoctorProvider')
  }
  return context
}
