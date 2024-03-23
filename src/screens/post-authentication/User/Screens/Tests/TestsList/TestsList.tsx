import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag
} from 'antd'
import {
  BarChartOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  PrinterOutlined,
  SettingOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { Constants, Enum, Types, Utils } from '@invinciblezealorg/lms-common'
import Table, { TableColumn } from '@Components/Table/TableComponent'

import { Fragment } from 'react'
import MoreButton from '@Components/MoreButton'
import PrintPrompt from '../TestCreator/TestBuilder/PrintPrompt'
import TestCard from './TestCard'
import TestStatusTag from './TestStatus'
import { Typography } from '@Components/Typography'
import { User } from '@invinciblezealorg/lms-common'
import dayjs from 'dayjs'
import { formatTime } from 'video.js/dist/types/utils/time'
import { useModal } from '@Components/ActionModal/ModalContext'
import { useNavigate } from 'react-router'

const { Text } = Typography

function TestsList(props: { filter: Types.GetTestsFilter }) {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const { data, isFetching: loading } = User.Queries.useGetTests(
    // props.filter
    props.filter
    // {
    //   // @ts-ignore
    //   enabled: !!props.filter.category
    // }
  )
  // const filteredData=data.filter(pd => {
  //   return !pd.endedAt;
  // })
  return (
    <Fragment>
      <Fragment>
        <Table
          searchFields={['title']}
          loading={loading}
          dataSource={data.filter(test =>
            props.filter.status.includes(test.status)
          )}
        >
          <TableColumn
            title="Title"
            dataIndex="title"
            key="title"
            render={(_: any, test: Types.Test) => (
              <Button
                onClick={() => navigate(`${test._id}/editor#information`)}
                type="link"
                size="small"
              >
                {test.title}
              </Button>
            )}
          />

          <TableColumn
            title="Input Type"
            dataIndex="inputType"
            key="inputType"
            render={(_: any, test: Types.Test) =>
              test?.input?.type === Enum.TestInputType.HANDWRITTEN ? (
                <Tag color="orange-inverse">Subjective</Tag>
              ) : (
                <Tag color="blue-inverse">Objective</Tag>
              )
            }
          />
          <TableColumn
            title="Last Updated"
            dataIndex="lastUpdated"
            key="lastUpdated"
            render={(_: any, test: Types.Test) =>
              // @ts-ignore
              dayjs(test.updatedAt).format('LL')
            }
          />
          {/* <TableColumn
            title="Analysis"
            dataIndex="analysis"
            key="analysis"
            render={(_: any, test: Types.Test) => (
              <Button
                icon={<BarChartOutlined />}
                size="small"
                type="primary"
                onClick={() => navigate(`${test._id}/status`)}
              >
                Show Analysis
              </Button>
            )}
          /> */}
          {/* <TableColumn
            title="Questions"
            dataIndex="status"
            key="status"
            render={(_: any, test: Types.Test) =>
              test.sections.map(i => i.items).flat().length
            }
          /> */}
          <TableColumn
            title="Status"
            dataIndex="status"
            key="status"
            // @ts-ignore
            render={(_: any, test: Types.Test) => <TestStatusTag test={test} />}
          />

          <TableColumn
            title="Enrolled"
            dataIndex="enrolled"
            key="enrolled"
            render={(_: any, test: Types.Test) => (
              <Text strong>{test.analytics.enrolled.count}</Text>
            )}
          />
          <TableColumn
            title="Duration"
            dataIndex="duration"
            key="duration"
            render={(_: any, test: Types.Test) =>
              test.duration.enabled ? (
                <Tag color='gold-inverse' icon={<ClockCircleOutlined />}>
                  {test.duration.value + ' mins'}
                </Tag>
              ) : (
                '-'
              )
            }
          />
          <TableColumn
            title="Action"
            key="action"
            render={(_: any, test: Types.Test, index: number) => (
              <MoreButton
                items={[
                  {
                    label: 'Open Test Builder',
                    key: 'test-builder',
                    icon: <SettingOutlined />,
                    onClick: () => {
                      window.open(`/app/products/test/${test._id}/builder`)
                    }
                  },
                  {
                    label: 'Show Analysis',
                    key: 'show-analysis',
                    icon: <LineChartOutlined />,
                    onClick: () => {
                      window.open(`/app/products/test/${test._id}/status`)
                    }
                  },
                  {
                    label: 'Print Action',
                    key: 'print',
                    icon: <PrinterOutlined />,
                    onClick: () => {
                      openModal(<PrintPrompt testId={test._id + ''} />, {
                        title: 'Print'
                      })
                    }
                  },
                  {
                    label: 'Upload Answer Sheets',
                    key: 'upload-answer-sheet',
                    icon: <UploadOutlined />,
                    onClick: () => {
                      window.open(`/app/test/${test._id}/answer-sheet/upload`)
                    }
                  }
                ]}
              />
            )}
          />
        </Table>
        {/* <List
          grid={{ gutter: 20, column: 4, xs: 1, sm: 2, md: 3 }}
          size="large"
          dataSource={
            loading
              ? SkeletonArr
              : data.filter(test => props.filter.status.includes(test.status))
          }
          renderItem={test => {
            const TestCardComponent = <TestCard test={test} />
            return (
              <div style={{ padding: 30 }}>
                {loading ? (
                  <SkeletonCard />
                ) : test.status === Enum.TestStatus.PUBLISHED ? (
                  <Badge.Ribbon text="Published" color="orange">
                    {TestCardComponent}
                  </Badge.Ribbon>
                ) : (
                  TestCardComponent
                )}
              </div>
            )
          }}
        /> */}
      </Fragment>
    </Fragment>
  )
}
export default TestsList

const SkeletonCard = () => (
  <Card>
    <Skeleton active paragraph />
    <Row justify={'space-between'}>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
      <Col>
        <Skeleton.Button style={{ marginTop: 20 }} block />
      </Col>
    </Row>{' '}
  </Card>
)
