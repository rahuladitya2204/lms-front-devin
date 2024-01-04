import { Button, Col, Row } from 'antd'
import React, { useCallback, useRef, useState } from 'react'

import LibPerspectiveCropper from 'react-perspective-cropper'

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

  return (
    <Row>
      <Col span={24}>
        {/* @ts-ignore */}
        <LibPerspectiveCropper
          ref={cropperRef}
          image={props.image}
          onChange={onChange}
          onDragStop={onDragStop}
          style={{ width: '100%', height: 'auto' }} // Example inline styling
        />
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={handleCrop}>
          Crop Image
        </Button>
      </Col>
    </Row>
  )
}
