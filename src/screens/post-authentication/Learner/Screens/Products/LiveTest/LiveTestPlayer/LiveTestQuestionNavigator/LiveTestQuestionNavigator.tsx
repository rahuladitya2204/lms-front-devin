import {
  CheckCircleFilled,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ReadOutlined
} from '@ant-design/icons'
import { Collapse, List, Progress, Tag, Timeline, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router'

import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

interface LiveTestQuestionNavigatorPropsI {
  liveTestId: string;
}

const { Text } = Typography

const LiveTestListItem = styled(List.Item)`
  .ant-list-item {
    padding: 15px !important;
    padding-right: 0 !important;
    span {
      width: 100% !important;
    }
  }
  .delete-icon {
    visibility: hidden;
  }
  &:hover {
    .delete-icon {
      visibility: visible;
    }
  }
  background: ${(props: { isActive: boolean }) =>
    props.isActive ? '#e3e3e3' : 'auto'};
`

const CollapsePanel = styled(Collapse.Panel)`
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`

export default function LiveTestQuestionNavigator(
  props: LiveTestQuestionNavigatorPropsI
) {
  const navigate = useNavigate()
  const { data: liveTest } = Learner.Queries.useGetLiveTestDetails(
    props.liveTestId + ''
  )
  //    const { data: { sections } } = Learner.Queries.useGetLiveTestStatus(
  const { data: { sections } } = Learner.Queries.useGetLiveTestStatus(
    props.liveTestId + ''
  )
  return (
    <Collapse
      defaultActiveKey={liveTest.sections.map(s => s._id)}
      bordered={false}
    >
      {sections.map(section => {
        return (
          <CollapsePanel key={section._id} header={section.title}>
            <List
              itemLayout="horizontal"
              style={{ marginBottom: 20 }}
              size="small"
              dataSource={section.items}
              renderItem={(item, itemIndex) => {
                const LiveTestSectionListItem = (isActive: boolean) => (
                  <LiveTestListItem
                    isActive={isActive}
                    extra={[
                      item.score ? <Tag color="blue">Score: {item.score}</Tag> : null,
                      <Tag icon={<ClockCircleOutlined />}>12 mins</Tag>
                    ]}
                  >
                    <List.Item.Meta
                      style={{ cursor: 'pointer' }}
                      title={<Text>{`Question ${itemIndex + 1}`}</Text>}
                      avatar={
                        item.isAnswered ? (
                          <CheckCircleTwoTone style={{ color: 'green' }} />
                        ) : (
                          <InfoCircleOutlined />
                        )
                      }
                    />
                  </LiveTestListItem>
                )
                return (
                  <Fragment>
                    <List.Item style={{ padding: 0 }}>
                      <NavLink
                        style={{ width: '100%' }}
                        key={item._id}
                        to={`${item._id}`}
                        children={({ isActive }) =>
                          LiveTestSectionListItem(isActive)
                        }
                      />
                    </List.Item>
                  </Fragment>
                )
              }}
            />
          </CollapsePanel>
        )
      })}
    </Collapse>
  )
}
