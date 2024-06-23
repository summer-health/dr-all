// care-plan-2/JS/CarePlanApp.js
'use client'
import React, { useState, useEffect } from 'react'
import Roadmap from './Roadmap'
import './careplan.css'

export default function CarePlanApp() {
  const [roadmaps, setRoadmaps] = useState([{ key: 0, startIndex: 1 }])
  const [totalItems, setTotalItems] = useState(3)

  const addNewRoadmap = () => {
    setTotalItems((prevTotal) => prevTotal + 3)
    setRoadmaps((prevRoadmaps) => [
      { key: prevRoadmaps.length, startIndex: totalItems + 1 },
      ...prevRoadmaps,
    ])
  }

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowUp') {
      addNewRoadmap()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <div>
      <h1>Care Plan Roadmap</h1>
      {roadmaps.map((roadmap) => (
        <Roadmap key={roadmap.key} startIndex={roadmap.startIndex} />
      ))}
    </div>
  )
}
