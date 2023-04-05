import { Collapse, List, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

import CoursePlayerNavigatorItem from './CoursePlayerNavigatorItem'
import { Fragment } from 'react'
import styled from '@emotion/styled'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  div.ant-collapse {
    border-radius: 0 !important;
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-list-item {
    padding: 15px;
  }
`

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
      <CustomCollapse
        // bordered={false}
        expandIconPosition="end"
        defaultActiveKey={sections.map((s, i) => s._id)}
      >
        {sections.map((section, index) => {
          return (
            <Panel
              header={
                <Typography.Title level={5}>
                  Section {index + 1}: {section.title}
                  {/* {sectionsCompleted}/{
                    totalSections
                  } */}
                </Typography.Title>
              }
              key={section._id}
            >
              <List
                bordered
                // itemLayout="horizontal"
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
            </Panel>
          )
        })}
      </CustomCollapse>
      {/* {sections.map((section, sectionIndex) => {
        return (
          <CustomCollapse>
         
          </CustomCollapse>
        )
      })} */}
    </Fragment>
  )
}

export default CoursePlayerNavigator
