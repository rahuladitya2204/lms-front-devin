import { Card } from 'antd'
import MediaPlayer from '../../../../components/MediaPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../hooks/CommonHooks'

function CourseItemViewer() {
  console.log('hel')
  const node = useGetNodeFromRouterOutlet()
  // const data = node.data || { url: '' }
  // console.log(node.data.url, 'node.data.url');
  const Component = <MediaPlayer url={''} />

  return <Card bodyStyle={{ padding: 0 }}>{Component}</Card>
}

export default CourseItemViewer
