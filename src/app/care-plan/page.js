'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Plane, PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { Modal, Box } from '@mui/material'
import CarePlanItemModal from './CarePlanItemModal'

function Sphere(props) {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={'yellow'} />
    </mesh>
  )
}

function Road({ offset }) {
  const texture = useTexture('/path-repeat.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 20)
  return (
    <Plane
      args={[3, 100]}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, offset]}
    >
      <meshBasicMaterial map={texture} transparent={true} />
    </Plane>
  )
}

function CarePlanItem({ url, position, rotation, scale, onClick }) {
  const texture = useTexture(url)
  return (
    <Plane
      args={[1, 1]}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
    >
      <meshBasicMaterial map={texture} />
    </Plane>
  )
}

function Scene({ cameraZ, carPosition, addMoreRows, onItemClick }) {
  const cameraRef = useRef()
  const [offsets, setOffsets] = useState([0])

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = cameraZ
      cameraRef.current.position.y = 1
      cameraRef.current.position.x = 0
      cameraRef.current.lookAt(0, 0, cameraZ - 5)

      if (cameraZ < -offsets.length * 100 + 50) {
        addMoreRows()
      }
    }
  })

  return (
    <>
      <PerspectiveCamera
        makeDefault
        ref={cameraRef}
        position={[0, 5, cameraZ]}
      />
      {offsets.map((offset, i) => (
        <>
          <Road key={i} offset={-i * 100} />
          <CarePlanItem
            url="/road-texture.png"
            position={[-5, 2, -10 - i * 100]}
            rotation={[0, Math.PI / 8, 0]}
            scale={[3, 3, 1]}
            onClick={onItemClick}
          />
          <CarePlanItem
            url="/road-texture.png"
            position={[5, 2, -20 - i * 100]}
            rotation={[0, Math.PI / 8, 0]}
            scale={[3, 3, 1]}
            onClick={onItemClick}
          />
          <CarePlanItem
            url="/road-texture.png"
            position={[-5, 2, -30 - i * 100]}
            rotation={[0, Math.PI / 8, 0]}
            scale={[3, 3, 1]}
            onClick={onItemClick}
          />
          <CarePlanItem
            url="/road-texture.png"
            position={[5, 2, -40 - i * 100]}
            rotation={[0, Math.PI / 8, 0]}
            scale={[3, 3, 1]}
            onClick={onItemClick}
          />
        </>
      ))}
      <Sphere position={carPosition} />
    </>
  )
}

export default function CarePlanApp() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [cameraZ, setCameraZ] = useState(10)
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0.5, z: 0 })
  const [rowCount, setRowCount] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

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
        const newZ = cameraZ - dragDelta * 0.1
        setCameraZ(newZ)
        setCarPosition((prev) => ({
          ...prev,
          z: prev.z - dragDelta * 0.1,
        }))
        setDragStart(event.clientY)
      }
    },
    [isDragging, dragStart, cameraZ]
  )

  const addMoreRows = useCallback(() => {
    setRowCount(rowCount + 1)
    setOffsets((prevOffsets) => [...prevOffsets, -prevOffsets.length * 100])
  }, [rowCount])

  const handleItemClick = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Canvas
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerUp}
      >
        <Scene
          cameraZ={cameraZ}
          carPosition={carPosition}
          addMoreRows={addMoreRows}
          onItemClick={handleItemClick}
        />
      </Canvas>
      <CarePlanItemModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
      />
    </>
  )
}
