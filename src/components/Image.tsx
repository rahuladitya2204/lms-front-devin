import { Image as AntDImage } from 'antd'
const FALLBACK =
  'https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg'
function Image(props: any) {
  return (
    <AntDImage preview={false} {...props} src={props.src || FALLBACK} fallback={FALLBACK} />
  )
}

export default Image
