// ImagePreview.js
import React, { useEffect, useState } from 'react'

const ImagePreview = ({ file }: { file: Blob }) => {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(
    () => {
      if (file) {
        const imageUrl: string = URL.createObjectURL(file)
        setImageSrc(imageUrl)

        return () => {
          URL.revokeObjectURL(imageUrl)
        }
      } else {
          setImageSrc('');
      }
    },
    [file]
  )

  return <div style={{width:100}}>{imageSrc && <img style={{width:'100%'}} src={imageSrc} alt="Preview" />}</div>
}

export default ImagePreview
