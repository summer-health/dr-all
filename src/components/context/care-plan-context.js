// Create a react context for storing a debug log of data submittable by downstream components.
'use client'

import { createContext, useContext, useState } from 'react'

const CarePlanContext = createContext()

export function CarePlanProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [carePlan, setCarePlan] = useState([])

  const addQuestion = (question) => {
    setQuestions((prevQuestions) => [...prevQuestions, question])
  }

  return (
    <CarePlanContext.Provider
      value={{ questions, addQuestion, carePlan, setCarePlan }}
    >
      {children}
    </CarePlanContext.Provider>
  )
}

export function useCarePlan() {
  const context = useContext(CarePlanContext)
  if (!context) {
    throw new Error('useCarePlan must be used within a CarePlanProvider')
  }
  return context
}
