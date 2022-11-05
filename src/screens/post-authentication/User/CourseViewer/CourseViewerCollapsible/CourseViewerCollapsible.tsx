import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  List,
  Row,
  Typography
} from 'antd'
import { PlayCircleFilled, PlayCircleOutlined } from '@ant-design/icons'

import { CourseSectionItem } from '../../../../../types/Common.types'
import CourseViewerCollapsibleItem from './CourseViewerCollapsibleItem'
import { Fragment } from 'react'
import styled from '@emotion/styled'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding-top: 0;
    padding-bottom: 0;
  }
`

interface CourseViewerCollapsiblePropsI {
  courseSections: CourseSectionItem[];
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

function CourseViewerCollapsible(props: CourseViewerCollapsiblePropsI) {
  return (
    <Fragment>
      <CustomCollapse expandIconPosition='end' defaultActiveKey={props.courseSections.map((s, i) => i)}>
        {props.courseSections.map((section, index) => {
          return (
            <Panel header="This is panel header 1" key={index}>
              <List
                itemLayout="horizontal"
                dataSource={section.items}
                renderItem={item => (
                  <List.Item>
                    <CourseViewerCollapsibleItem
                      toggleItemCheck={props.toggleItemCheck}
                      item={item}
                    />
                  </List.Item>
                )}
              />
              {/* {section.items.map(item => {
                return (
                  <CourseViewerCollapsibleItem
                    toggleItemCheck={props.toggleItemCheck}
                    item={item}
                  />
                )
              })} */}
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

export default CourseViewerCollapsible
