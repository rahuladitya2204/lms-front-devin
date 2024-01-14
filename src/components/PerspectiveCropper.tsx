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
  const [croppedImg, setCroppedImg] = useState(null)
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

  const handleCrop = async () => {
    try {
      // @ts-ignore
      const cv = window.cv
      const filterCvParams = {
        // Do not apply binary threshold
        binarize: false,

        // Apply adaptive thresholding if necessary with a type that does not convert to binary
        th: true,
        thMode: 3,
        thMeanCorrection: 10,
        thBlockSize: 11,
        thMax: 255,

        // Contrast and brightness adjustment (tune these values accordingly)
        contrast: 1.5,
        brightness: 0,

        // Morphological operations (dilation)
        morphological: true,
        morphType: 1,
        morphSize: new cv.Size(3, 3) // Adjust the kernel size as needed
      }

      const filterParams = {
        preview: true,
        filterCvParams
      }
      // @ts-ignore
      const cropped = await cropperRef.current.done(filterParams)
      setCroppedImg(cropped)
      console.log('Image Cropped', cropped)
      // props.onCrop && props.onCrop(cropped, props.closeModal)
    } catch (e) {
      console.log('error', e)
    }
  }

  // console.log(maxWidth, 'wmai')
  const { isMobile } = useBreakpoint()
  return (
    <>
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
    </Row>
    <Row justify={'space-between'}>
              <Col
        
       
      >
        <Button
          style={{ marginTop: 20 }}
          block={isMobile}
          // type="primary"
          onClick={handleCrop}
        >
          Crop Image
        </Button>
      </Col>
      <Col >
        <Button
          style={{ marginTop: 20 }}
          block={isMobile}
          type="primary"
          onClick={() =>
            props.onCrop && props.onCrop(croppedImg, props.closeModal)
          }
        >
          Proceed with Image
        </Button>
      </Col>
      </Row>
    </>
  )
}
