import {
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Table,
  Typography
} from 'antd'

import Container from '@Components/Container'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'

const { confirm } = Modal
interface TestLearnersPropsI {
  testId: string;
}

function TestLearners(props: TestLearnersPropsI) {
  const { data, isLoading: loading } = User.Queries.useGetEnrolledProductLearners(
    props.testId + ''
  )

  const {
    mutate: removeLearnerFromTest
  } = User.Queries.useRemoveLearnerFromCourse()

  return (
    <Container title="Tests Learners" extra={[<Button>Add Learner</Button>]}>
      <Table dataSource={data} loading={loading}>
        <Table.Column
          title="Name"
          dataIndex="name"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            capitalize(record.learner.name)
          }
        />
        <Table.Column
          title="Enrolled At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledProductDetails) => (
            <Space size="middle">{dayjs(record.enrolledAt).format('LL')}</Space>
          )}
        />
        <Table.Column
          title="Email"
          dataIndex="learner.email"
          key="learner.email"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            record.learner.email
          }
        />
        {/* <Table.Column
title="Last Login"
dataIndex="lastActive"
key="lastActive"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.lastActive).format('LLLL')}</Space>
)}
/>
<Table.Column
title="Joined On"
dataIndex="createdAt"
key="createdAt"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.createdAt).format('LL')}</Space>
)}
/> */}
        <Table.Column
          title="Action"
          key="action"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            return (
              <Space>
                <Button
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      // icon: <ExclamationCircleOutlined />,
                      content: `You want to refund this Test to the user`,
                      onOk() {
                        removeLearnerFromTest({
                          courseId: props.testId,
                          // @ts-ignore
                          learnerId: record.learner._id
                        })
                      },
                      okText: 'Initiate Refund'
                    })
                  }}
                  size="small"
                  type="primary"
                >
                  Refund
                </Button>
                {/* <Dropdown
          menu={{
            items: [
              {
                label: `Refund Test`,
                key: 'refund'
              },
              {
                label: `Revoke Access`,
                key: 'revoke'
              }
            ]
          }}
          trigger={['click']}
        >
          <MoreOutlined />
        </Dropdown> */}
              </Space>
            )
          }}
        />
      </Table>
    </Container>
  )
}

export default TestLearners
