// care-plan-2/JS/Roadmap.js
'use client'
import React from 'react'
import CarePlanItem from './CarePlanItem'
import './careplan.css'

const Roadmap = ({ startIndex }) => {
  const roadmapItems = [
    { id: startIndex, top: '20%', left: '10%', label: `Item ${startIndex}` },
    {
      id: startIndex + 1,
      top: '40%',
      left: '30%',
      label: `Item ${startIndex + 1}`,
    },
    {
      id: startIndex + 2,
      top: '60%',
      left: '20%',
      label: `Item ${startIndex + 2}`,
    },
  ]

  return (
    <div className="roadmap-container">
      {roadmapItems.map((item) => (
        <CarePlanItem
          key={item.id}
          style={{ top: item.top, left: item.left }}
          onClick={() => console.log(`Clicked on ${item.label}`)}
        >
          {item.label}
        </CarePlanItem>
      ))}
    </div>
  )
}

export default Roadmap
