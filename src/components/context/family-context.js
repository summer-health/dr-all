'use client'

import { createContext, useContext, useState } from 'react'

const FamilyContext = createContext()

export function FamilyProvider({ children }) {
  const [family, setFamily] = useState([])

  return (
    <FamilyContext.Provider value={{ family, setFamily }}>
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
