import { Button, Card, Checkbox, Col, Collapse, Row, Typography } from 'antd'
import { PlayCircleFilled, PlayCircleOutlined } from '@ant-design/icons'

import { CourseTreeTypeNode } from '../../../../../types/Common.types'
import CourseViewerCollapsibleItem from './CourseViewerCollapsibleItem'
import { Fragment } from 'react'
import styled from '@emotion/styled'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
  }
`


interface CourseViewerCollapsiblePropsI {
  courseTree: CourseTreeTypeNode[];
  toggleItemCheck: (itemID: string, value: boolean) => void;
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
                  <CourseViewerCollapsibleItem
                    toggleItemCheck={props.toggleItemCheck}
                    item={item}
                  />
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
