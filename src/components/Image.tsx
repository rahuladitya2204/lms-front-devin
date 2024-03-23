// @ts-nocheck
import { Image as AntDImage, ImageProps } from 'antd'
import { useEffect, useState } from 'react'

import { Common } from '@adewaskar/lms-common'
import { Skeleton } from 'antd'
import styled from '@emotion/styled'

interface ImagePropsI extends ImageProps {
  file?: string;
  holderStyle?: any;
  noLoadNoShowPlaceholder?: React.ReactNode;
  caption?: React.ReactNode;
}

const ImageHolder = styled.div(
  (props: { width?: number, height: number }) => `
width:${props.width ? props.width + 'px' : 'auto'};
object-fit: cover;
display: flex;
align-items: center;
justify-content: center;
overflow: hidden;
.ant-upload-wrapper.ant-upload-picture-card-wrapper{
  width: 100% !imporat;
}
height:${props.height ? props.height : 'auto'}px;
`
)

const ImageComponent = styled(AntDImage)`
  object-fit: cover !important;
`

const FALLBACK = `/images/not-found.png`

function AppImage(props: ImagePropsI) {
  const [hasLoaded, setHasLoaded] = useState(false)
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(props.file, {
    enabled: !!props.file
  })
  const Url = props.src || url

  useEffect(
    () => {
      setHasLoaded(false)
      const img = new Image()
      img.src = Url
      img.onload = () => setHasLoaded(true)
    },
    [Url]
  )

  // if (props.noLoadNoShowPlaceholder && !hasLoaded) {
  //   return <Skeleton.Image /> // Do not render anything if the image hasn't loaded and noLoadNoShowPlaceholder is true
  // }

  return (
    <div>
      <ImageHolder
        style={{ ...props.holderStyle }}
        width={props.width}
        height={props.height}
      >
        {props.noLoadNoShowPlaceholder && !hasLoaded ? (
          props.noLoadNoShowPlaceholder
        ) : (
          <ImageComponent
            preview={false}
            width="100%"
            height="100%"
            {...props}
            src={Url || FALLBACK}
            fallback={<Skeleton.Image active />}
          />
        )}
      </ImageHolder>
      {props.caption ? <p style={{ margin: 0 }}>{props.caption}</p> : null}
    </div>
  )
}

export default AppImage
