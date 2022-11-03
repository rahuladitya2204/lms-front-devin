import { Button, Card, Checkbox, Col, Collapse, Row, Typography } from 'antd'
import { PlayCircleFilled, PlayCircleOutlined } from '@ant-design/icons'

import { CourseTreeTypeNode } from '../../../../../types/Common.types'
import CourseViewerCollapsibleItem from './CourseViewerCollapsibleItem'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { useUpdateCourse } from '../../../../../queries/Courses/CoursesQueries'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
  }
`

const CollapsibleNavlink = styled(NavLink)`
  .active-link {
    .ant-card-body {
      background: grey;
    }
  }
`

interface CourseViewerCollapsiblePropsI {
  courseTree: CourseTreeTypeNode[];
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

let activeStyle = {
  background: 'grey'
}

function CourseViewerCollapsible(props: CourseViewerCollapsiblePropsI) {
  return (
    <Fragment>
      {props.courseTree.map((parent, parentIndex) => {
        return (
          <CustomCollapse expandIconPosition="end" defaultActiveKey={['1']}>
            <Panel
              header={
                <Typography.Title style={{ marginBottom: 0 }} level={5}>
                  Section {parentIndex + 1}
                </Typography.Title>
              }
              key="1"
            >
              {parent.children.map((item, itemIndex) => {
                return (
                  <CollapsibleNavlink
                    to={`item/${item.id}`}
                    style={({ isActive }) =>
                      isActive ? activeStyle : undefined
                    }
                  >
                    <CourseViewerCollapsibleItem toggleItemCheck={props.toggleItemCheck} item={item} />
                  </CollapsibleNavlink>
                )
              })}
            </Panel>
          </CustomCollapse>
        )
      })}
    </Fragment>
  )
}

export default CourseViewerCollapsible
