import { Card, Checkbox, Col, List, Row, Space, Typography } from 'antd'

import { CourseSectionItem } from '../../../../../types/Common.types'
import { NavLink } from 'react-router-dom'
import { PlayCircleFilled } from '@ant-design/icons'
import styled from '@emotion/styled'

interface CoursePlayerCollapsibleItemPropsI {
  item: CourseSectionItem;
  toggleItemCheck: (itemID: string, value: boolean) => void;
}

const CollapsibleNavlink = styled(NavLink)`
  a {
    width: 100%;
    padding-left: 19px;
  }
`

const CustomPanelCard = styled(Card)`
  .ant-card {
    padding: 20px 14px;
  }

  .ant-card-body {
    padding: 12px;
    background: ${(props: { isActive: boolean }) =>
      props.isActive ? '#e7e8e9' : '#fff'};
  }

  &:hover {
    background: #e8edf0;
  }
`

function CoursePlayerCollapsibleItem(props: CoursePlayerCollapsibleItemPropsI) {
  return (
    <List.Item.Meta
      avatar={
        <Checkbox
          defaultChecked={props.item.checked}
          onChange={e =>
            props.toggleItemCheck(props.item.id, !!e.target.checked)
          }
        />
      }
      title={
        <NavLink to={`item/${props.item.id}`}
          children={<a href="https://ant.design">{props.item.title}</a>}
        />
      }
      description={
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
      }
    />
  )
}

export default CoursePlayerCollapsibleItem
