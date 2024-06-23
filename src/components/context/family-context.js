'use client'

import { createContext, useContext, useState } from 'react'

const FamilyContext = createContext()

export function FamilyProvider({ children }) {
  const [family, setFamily] = useState({})
  const [familyQuestions, setFamilyQuestions] = useState([])

  const addFamilyQuestion = (question) => {
    setFamilyQuestions((prevQuestions) => [...prevQuestions, question])
  }

  return (
    <FamilyContext.Provider
      value={{
        family,
        setFamily,
        familyQuestions,
        setFamilyQuestions,
        addFamilyQuestion,
      }}
    >
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a DoctorProvider')
  }
  return context
}
