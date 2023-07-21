import CourseEditor from '../CourseBuilder/CourseEditor'
import { Tabs } from 'antd'

export default function CourseCreator () {
  return (
    <Tabs
      tabPosition={`left`}
      items={[
        {
          label: 'Information',
          key: 'information',
          children: <CourseEditor />
        }
      ]}
    />
  )
}
