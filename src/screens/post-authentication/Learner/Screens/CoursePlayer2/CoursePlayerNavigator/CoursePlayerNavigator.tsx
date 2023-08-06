import { Card, Collapse, List, Progress, Space, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import CoursePlayerNavigatorItem from './CoursePlayerNavigatorItem'
import { Fragment } from 'react'

interface CoursePlayerNavigatorPropsI {
  courseId: string;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CoursePlayerNavigator(props: CoursePlayerNavigatorPropsI) {
  const { data: course } = Learner.Queries.useGetCourseDetails(props.courseId, {
    enabled: !!props.courseId
  })
  const sections = course.sections
  return (
    <Fragment>
      {sections.map((section, index) => {
        const itemsCompleted = section.items.filter(item => item.isCompleted)
        // const sectionProgress = Math.ceil(
        //   itemsCompleted.length / section.items.length * 100
        // )
        return (
          <Card
            bodyStyle={{ padding: 0 }}
            key={section._id}
            title={section.title}
            // extra={<a href="#">More</a>}
            style={{ marginBottom: 20 }}
          >
            <List
              dataSource={section.items}
              renderItem={(item, itemIndex) => (
                <CoursePlayerNavigatorItem
                  courseId={props.courseId}
                  section={section}
                  toggleItemCheck={props.toggleItemCheck}
                  item={item}
                  itemIndex={index + itemIndex + 1}
                />
              )}
            />
          </Card>
        )
      })}
    </Fragment>
  )
}

export default CoursePlayerNavigator
