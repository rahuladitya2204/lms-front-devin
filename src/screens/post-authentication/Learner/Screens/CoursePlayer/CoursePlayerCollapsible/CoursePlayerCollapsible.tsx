import { Collapse, List, Typography } from 'antd'

import CoursePlayerCollapsibleItem from './CoursePlayerCollapsibleItem'
import { Fragment } from 'react'
import styled from '@emotion/styled'
import { CourseSection } from '@Types/Courses.types'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding-top: 0;
    padding-bottom: 0;
  }

  div.ant-collapse {
    border-radius: 0 !important;
  }

  .ant-collapse-content-box {
    padding: 0;
  }

  .ant-list-item {
    padding: 15px;
  }
`

interface CoursePlayerCollapsiblePropsI {
  sections: CourseSection[];
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CoursePlayerCollapsible(props: CoursePlayerCollapsiblePropsI) {
  return (
    <Fragment>
      <CustomCollapse
        expandIconPosition="end"
        defaultActiveKey={props.sections.map((s, i) => s.id)}
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
              key={section.id}
            >
              <List
                // itemLayout="horizontal"
                dataSource={section.items}
                renderItem={(item, itemIndex) => (
                  <CoursePlayerCollapsibleItem
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

export default CoursePlayerCollapsible
