import { useGetNodeFromRouterOutlet } from '../../../../hooks/CommonHooks'
import CoursePlayerTextItem from './CoursePlayerItems/Text'

function CoursePlayerItem () {
  const node = useGetNodeFromRouterOutlet()
  console.log(node,'nodddd')
  return <CoursePlayerTextItem item={node} />
}

export default CoursePlayerItem
