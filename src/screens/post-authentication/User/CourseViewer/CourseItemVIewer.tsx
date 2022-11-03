import { Card } from 'antd'
import MediaPlayer from '../../../../components/MediaPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../hooks/CommonHooks'

function CourseItemViewer () {
  const node = useGetNodeFromRouterOutlet();
  const Component = (
    <MediaPlayer url='https://www.youtube.com/watch?v=bMknfKXIFA8' />
  )

  return <Card bodyStyle={{ padding: 0 }}>{Component}</Card>
}

export default CourseItemViewer
