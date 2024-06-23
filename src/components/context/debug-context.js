// Create a react context for storing a debug log of data submittable by downstream components.
'use client'

import { createContext, useContext, useState } from 'react'

const DebugContext = createContext()

export function DebugProvider({ children }) {
  const [log, setLog] = useState([])

  const logData = (data) => {
    if (!data.id) {
      // Generate id if not present
      data.id = Math.random().toString(36).substring(7)
    }

    setLog((prevLog) => [data, ...prevLog])
  }

  return (
    <DebugContext.Provider value={{ log, logData }}>
      {children}
    </DebugContext.Provider>
  )
}

export function useDebug() {
  const context = useContext(DebugContext)
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider')
  }
  return context
}
