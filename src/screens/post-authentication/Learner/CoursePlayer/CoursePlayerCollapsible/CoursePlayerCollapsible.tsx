import { Badge, Collapse, List, Typography } from 'antd'

import CoursePlayerCollapsibleItem from './CoursePlayerCollapsibleItem'
import { CourseSectionItem } from '../../../../../types/Common.types'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'

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

const CourseListItem = styled(List.Item)`
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`

interface CoursePlayerCollapsiblePropsI {
  courseSections: CourseSectionItem[];
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CoursePlayerCollapsible(props: CoursePlayerCollapsiblePropsI) {
  return (
    <Fragment>
      <CustomCollapse
        expandIconPosition="end"
        defaultActiveKey={props.courseSections.map((s, i) => i)}
      >
        {props.courseSections.map((section, index) => {
          let sectionsCompleted = 0
          const totalSections = section.items.length
          section.items.forEach(i => {
            if (i.checked) sectionsCompleted += 1
          })
          return (
            <Panel
              header={
                <Typography.Title level={5}>
                  {section.title} {sectionsCompleted}/{totalSections}
                </Typography.Title>
              }
              key={index}
            >
              <List
                itemLayout="horizontal"
                dataSource={section.items}
                renderItem={item => (
                  <NavLink
                    to={`item/${item.id}`}
                    children={({ isActive }) => (
                      <CourseListItem isActive={isActive}>
                        <CoursePlayerCollapsibleItem
                          toggleItemCheck={props.toggleItemCheck}
                          item={item}
                        />
                      </CourseListItem>
                    )}
                  />
                )}
              />
            </Panel>
          )
        })}
      </CustomCollapse>
      {/* {props.courseSections.map((section, sectionIndex) => {
        return (
          <CustomCollapse>
         
          </CustomCollapse>
        )
      })} */}
    </Fragment>
  )
}

export default CoursePlayerCollapsible
