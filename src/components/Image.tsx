// @ts-nocheck
import { Image as AntDImage, ImageProps } from 'antd'

import styled from '@emotion/styled'
import { Common } from '@adewaskar/lms-common'

interface ImagePropsI extends ImageProps {
  file?: string;
}

const ImageHolder = styled.div(
  (props: { width?: number, height: number }) => `
width:${props.width ? props.width : 'auto'};
object-fit: cover;
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

function Image(props: ImagePropsI) {
  const { data: url } = Common.Queries.useGetPresignedUrlFromFile(props.file, {
    enabled: !!props.file
  })
  const Url = props.src || url

  return (
    <ImageHolder width={props.width} height={props.height}>
      <ImageComponent
        preview={false}
        width="100%"
        height="100%"
        {...props}
        src={Url || FALLBACK}
        fallback={FALLBACK}
      />
    </ImageHolder>
  )
}

export default Image
