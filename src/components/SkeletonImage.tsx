import { Skeleton } from 'antd'
import { SkeletonImageProps } from 'antd/lib/skeleton/Image'
import styled from '@emotion/styled'

interface SkeletonImagePropsI extends SkeletonImageProps {}

const SkeletonImageHolder = styled(Skeleton.Node)`
  .ant-skeleton.ant-skeleton-element {
    display: flex !important;
  }
`

export default function SkeletonImage(props: SkeletonImagePropsI) {
  return <SkeletonImageHolder active {...props} />
}
