import { Card, Checkbox, Col, Row, Space, Typography } from 'antd'

import { CourseTreeTypeNode } from '../../../../../types/Common.types'
import { PlayCircleFilled } from '@ant-design/icons'
import styled from '@emotion/styled'

interface CourseViewerCollapsibleItemPropsI {
  item: CourseTreeTypeNode;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CustomPanelCard = styled(Card)`
  .ant-card {
    padding: 20px 14px;
  }

  .ant-card-body {
    padding: 12px;
  }

  &:hover {
    background: #e8edf0;
  }
`

function CourseViewerCollapsibleItem(props: CourseViewerCollapsibleItemPropsI) {
  return (
    <CustomPanelCard>
      <Row gutter={[0, 0]}>
        <Col span={4}>
          <Checkbox
            defaultChecked={props.item.checked}
            onChange={e =>
              props.toggleItemCheck(props.item.id, !!e.target.checked)
            }
          />
        </Col>
        <Col span={20}>
          <Typography.Text style={{ fontSize: 16 }} ellipsis>
            {props.item.title}
          </Typography.Text>
          <Row gutter={[10, 10]}>
            <Col span={12}>
              <Typography.Text
                style={{
                  color: 'grey',
                  fontSize: 14,
                  marginTop: '5px',
                  display: 'block'
                }}
              >
                <PlayCircleFilled /> 12 min
              </Typography.Text>
            </Col>
            <Col span={12}>{/* <Button size="small">Resources</Button> */}</Col>
          </Row>
        </Col>
      </Row>
    </CustomPanelCard>
  )
}

export default CourseViewerCollapsibleItem
