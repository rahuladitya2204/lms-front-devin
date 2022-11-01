import { Card, Col, Collapse, Row, Typography } from 'antd'

import MediaPlayer from '../../../../components/MediaPlayer'
import styled from '@emotion/styled'
import { useGetNodeFromRouterOutlet } from '../../../../hooks/CommonHooks'

function CourseItemViewer () {
  const node = useGetNodeFromRouterOutlet()
  const Component = (
    <MediaPlayer url="https://www.youtube.com/watch?v=oUFJJNQGwhk" />
  )

  return <Card bodyStyle={{ padding: 0 }}>{Component}</Card>
}

export default CourseItemViewer
