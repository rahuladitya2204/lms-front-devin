import './watermark.css'

import React, { useEffect, useRef, useState } from 'react'

const WatermarkPlugin = (props: any) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const videoRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        // @ts-ignore
        const videoWidth = videoRef.current.clientWidth
        // @ts-ignore
        const videoHeight = videoRef.current.clientHeight

        const newPosition = {
          top: Math.floor(Math.random() * (videoHeight - 30)), // 30 is an arbitrary offset to keep the watermark within bounds
          left: Math.floor(Math.random() * (videoWidth - 100)) // 100 is an arbitrary offset to keep the watermark within bounds
        }

        // @ts-ignore
        setPosition(newPosition)
      }
    }, 5000) // Change the position every 5 seconds

    return () => clearInterval(interval)
  })

  return (
    <div ref={videoRef}>
      {props.children}
      <div
        className={`watermark ${position}`}
        style={{ top: position.top, left: position.left }}
      >
        Your Watermark
      </div>
    </div>
  )
}

export default WatermarkPlugin
