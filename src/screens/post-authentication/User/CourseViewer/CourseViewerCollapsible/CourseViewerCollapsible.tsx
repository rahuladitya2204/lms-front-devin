import { Button, Card, Checkbox, Col, Collapse, Row, Typography } from 'antd'

import { CourseTreeTypeNode } from '../../../../../types/Common.types'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { PlayCircleOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'

const { Panel } = Collapse

const CustomCollapse = styled(Collapse)`
  .ant-collapse-content-box {
    padding: 0;
  }
`

const CustomPanelCard = styled(Card)`
  .ant-card {
    padding: 20px 14px;
  }
`

interface CourseViewerCollapsiblePropsI {
  courseTree: CourseTreeTypeNode[];
}

function CourseViewerCollapsible(props: CourseViewerCollapsiblePropsI) {
  return (
    <Fragment>
      {props.courseTree.map((parent, parentIndex) => {
        return (
          <CustomCollapse defaultActiveKey={['1']}>
            <Panel
              header={
                <Typography.Title level={5}>
                  Section {parentIndex + 1}
                </Typography.Title>
              }
              key="1"
            >
              {parent.children.map((child, childIndex) => {
                return (
                  <NavLink
                    to={`item/${child.id}`}
                    // style={({ isActive }) =>
                    //   isActive ? activeStyle : undefined
                    // }
                  >
                    <CustomPanelCard>
                      <Row gutter={[16, 16]}>
                        <Col span={4}>
                          <Checkbox />
                        </Col>
                        <Col span={20}>
                          <Typography.Title level={5}>
                            {child.title}
                          </Typography.Title>
                          <Row gutter={[10, 10]}>
                            <Col span={12}>
                              <PlayCircleOutlined /> 12 min
                            </Col>
                            <Col span={12}>
                              <Button size="small">Resources</Button>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </CustomPanelCard>
                  </NavLink>
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
