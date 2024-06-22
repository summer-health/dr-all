'use client'

import React, { useRef } from 'react'

import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import { Plane, Sprite, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useCallback } from 'react'

function LightBulb(props) {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={'yellow'} />
    </mesh>
  )
}

function Road() {
  return (
    <Plane args={[10, 100]} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial color={0x333333} />
    </Plane>
  )
}

function Sprites({ count = 5 }) {
  const spriteRefs = useRef([])
  const { scene } = useThree()

  const handleClick = (event) => {
    event.stopPropagation()
    console.log('Sprite clicked!', event.object)
    // Handle sprite click here
  }

  return Array.from({ length: count }).map((_, i) => <LightBulb />)
}

export function Scene({ cameraZ }) {
  const cameraRef = useRef()

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraZ
      cameraRef.current.lookAt(0, 0, cameraZ - 35) // Look 35 units ahead of the camera
    }
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, 5, cameraZ]}
      />
      <Road />
      <Sprites />
    </>
  )
}

export default function CarePlan() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [cameraZ, setCameraZ] = useState(15)

  const handlePointerDown = useCallback((event) => {
    setIsDragging(true)
    setDragStart(event.clientY)
  }, [])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handlePointerMove = useCallback(
    (event) => {
      if (isDragging) {
        const dragDelta = event.clientY - dragStart
        const newZ = cameraZ - dragDelta * 0.1 // Adjust 0.1 to change sensitivity
        setCameraZ(Math.max(0, newZ)) // Prevent camera from going behind the start of the road
        setDragStart(event.clientY)
      }
    },
    [isDragging, dragStart, cameraZ]
  )

  return (
    <>
      <Canvas
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      >
        <Scene cameraZ={cameraZ} />
      </Canvas>
    </>
  )
}
