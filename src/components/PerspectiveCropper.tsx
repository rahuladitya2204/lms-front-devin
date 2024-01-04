import { Button, Col, Row } from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import LibPerspectiveCropper from 'react-perspective-cropper'
import useBreakpoint from '@Hooks/useBreakpoint'
// @ts-ignore
import { useOpenCv } from 'opencv-react'

interface PerspectiveCropperPropsI {
  image: any;
  onCrop?: Function;
  closeModal?: Function;
}

export default function PerspectiveCropper(props: PerspectiveCropperPropsI) {
  const [cropState, setCropState] = useState()
  const cropperRef = useRef()
  // @ts-ignore

  const onDragStop = useCallback(s => setCropState(s), [])
  // @ts-ignore

  const onChange = useCallback(s => setCropState(s), [])
  const [maxWidth, setMaxWidth] = useState(100) // default maxWidth
  const containerRef = useRef(null) // Ref for the parent container

  useEffect(() => {
    const handleResize = () => {
      // Check if the container ref is available and then update maxWidth
      if (containerRef.current) {
        // @ts-ignore
        const newMaxWidth = containerRef.current.offsetWidth
        setMaxWidth(newMaxWidth)
      }
    }

    window.addEventListener('resize', handleResize)

    // Call it initially to set the initial size
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty dependency array means this effect runs once on mount
  const { loaded, cv } = useOpenCv()

  const handleCrop = async () => {
    try {
      // @ts-ignore
      const cropped = await cropperRef.current.done({ preview: true })
      console.log('Image Cropped', cropped)
      props.onCrop && props.onCrop(cropped, props.closeModal)
    } catch (e) {
      console.log('error', e)
    }
  }

  useEffect(() => {
    const initFilterParams = async () => {
      console.log(cropState)
      try {
        // @ts-ignore
        const res = await cropperRef.current.done({
          blur: false, // Keep detail by not blurring
          th: true, // Enable thresholding
          thMode: cv.ADAPTIVE_THRESH_MEAN_C, // Use a mean adaptive method
          thMeanCorrection: 10, // Correction factor for the threshold
          thBlockSize: 11, // Block size for adaptive thresholding
          thMax: 255, // Maximum value used for THRESH_BINARY or THRESH_BINARY_INV
          grayScale: true
        })
        console.log(res)
      } catch (e) {
        console.log('error', e)
      }
    }

    initFilterParams()
  }, [])
  // console.log(maxWidth, 'wmai')
  const { isMobile } = useBreakpoint()
  return (
    <Row style={{ marginTop: 30 }}>
      <Col ref={containerRef} span={24}>
        {/* @ts-ignore */}
        <LibPerspectiveCropper
          maxWidth={maxWidth}
          ref={cropperRef}
          image={props.image}
          onChange={onChange}
          onDragStop={onDragStop}
          // style={{ width: '100%', height: 'auto' }} // Example inline styling
        />
      </Col>
      <Col
        span={24}
        style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}
      >
        <Button
          style={{ marginTop: 20 }}
          block={isMobile}
          type="primary"
          onClick={handleCrop}
        >
          Crop Image
        </Button>
      </Col>
    </Row>
  )
}
