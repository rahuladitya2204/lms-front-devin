import { Collapse, List, Typography } from 'antd'

import CoursePlayerNavigatorItem from './CoursePlayerNavigatorItem'
import { Fragment } from 'react'
import { Types } from '@adewaskar/lms-common'
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
  sections: Types.CourseSection[];
  courseId: string;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CoursePlayerNavigator(props: CoursePlayerNavigatorPropsI) {
  return (
    <Fragment>
      <CustomCollapse
        expandIconPosition="end"
        defaultActiveKey={props.sections.map((s, i) => s._id)}
      >
        {props.sections.map((section, index) => {
          let sectionsCompleted = 0;
          const totalSections = section.items.length
          // section.items.forEach(i => {
          //   if (i.checked) sectionsCompleted += 1
          // })
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
                // itemLayout="horizontal"
                dataSource={section.items}
                renderItem={(item, itemIndex) => (
                  <CoursePlayerNavigatorItem courseId={props.courseId}
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
      {/* {props.sections.map((section, sectionIndex) => {
        return (
          <CustomCollapse>
         
          </CustomCollapse>
        )
      })} */}
    </Fragment>
  )
}

export default CoursePlayerNavigator
