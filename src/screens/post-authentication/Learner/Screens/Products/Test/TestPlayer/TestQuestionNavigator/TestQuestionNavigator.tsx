import { CheckCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons'
import { Collapse, List, Spin, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router'

import { Fragment } from 'react'
import { Learner } from '@adewaskar/lms-common'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

interface TestQuestionNavigatorPropsI {
  testId: string;
}

const { Text } = Typography

const TestListItem = styled(List.Item)`
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

export default function TestQuestionNavigator(
  props: TestQuestionNavigatorPropsI
) {
  const navigate = useNavigate()
  const { data: test } = Learner.Queries.useGetTestDetails(props.testId + '')
  //    const { data: { sections } } = Learner.Queries.useGetTestStatus(
  const { data: { sections }, isLoading } = Learner.Queries.useGetTestStatus(
    props.testId + ''
  )
  return (
    <Spin spinning={isLoading}>
      {' '}
      <Collapse
        defaultActiveKey={test.sections.map(s => s._id)}
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
                  const TestSectionListItem = (isActive: boolean) => (
                    <TestListItem
                      isActive={isActive}
                      extra={[
                        item.score ? (
                          <Tag color="blue">Score: {item.score}</Tag>
                        ) : null
                        // <Tag icon={<ClockCircleOutlined />}>12 mins</Tag>
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
                    </TestListItem>
                  )
                  return (
                    <Fragment>
                      <List.Item style={{ padding: 0 }}>
                        <NavLink
                          style={{ width: '100%' }}
                          key={item._id}
                          to={`${item._id}`}
                          children={({ isActive }) =>
                            TestSectionListItem(isActive)
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
    </Spin>
  )
}
