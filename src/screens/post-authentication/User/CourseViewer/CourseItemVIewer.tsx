import { Card } from 'antd'
import MediaPlayer from '../../../../components/MediaPlayer'
import { useGetNodeFromRouterOutlet } from '../../../../hooks/CommonHooks'

function CourseItemViewer () {

  const node = useGetNodeFromRouterOutlet()
  // const data = node.data || { url: '' }
  // console.log(node.data.url, 'node.data.url');
  const url = 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
  const Component = <MediaPlayer url={url} />

  return Component
}

export default CourseItemViewer
