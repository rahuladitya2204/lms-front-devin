import { useGetNodeFromRouterOutlet } from '../../../../../hooks/CommonHooks';
import CoursePlayerTextItem from './CoursePlayerItems/Text'

function CoursePlayerItem () {
  const node = useGetNodeFromRouterOutlet()
  // return <CoursePlayerTextItem item={node} />
  return null;
}

export default CoursePlayerItem
