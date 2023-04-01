// @ts-nocheck
import { Image as AntDImage, ImageProps } from 'antd'

import styled from '@emotion/styled'

const ImageHolder = styled.div(
  (props: { width?: number, height: number }) => `
width:${props.width ? props.width : 'auto'};
height:${(p: { height: number }) => (p.height ? p.height : 'auto')};
object-fit: cover;
overflow: hidden;

`
)

const FALLBACK =
  'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921'

function Image(props: ImageProps) {
  return (
    <ImageHolder width={props.width} height={props.height}>
      <AntDImage
        preview={false}
        width="100%"
        height="100%"
        {...props}
        src={props.src || FALLBACK}
        fallback={FALLBACK}
      />
    </ImageHolder>
  )
}

export default Image
