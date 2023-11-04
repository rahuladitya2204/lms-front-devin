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
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons'

import Container from '@Components/Container'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'

const { confirm } = Modal
interface CourseLearnersPropsI {
  courseId: string;
}

function CourseLearners(props: CourseLearnersPropsI) {
  const { data, isLoading: loading } = User.Queries.useGetCourseLearners(
    props.courseId + ''
  )

  const {
    mutate: removeLearnerFromCourse
  } = User.Queries.useRemoveLearnerFromCourse()

  return (
    <Container title="Course Learners" extra={[<Button>Add Learner</Button>]}>
      <Table dataSource={data} loading={loading}>
        <Table.Column
          title="Name"
          dataIndex="name"
          render={(_: any, record: Types.EnrolledCourse) =>
            capitalize(record.learner.name)
          }
        />
        <Table.Column
          title="Enrolled At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledCourse) => (
            <Space size="middle">{dayjs(record.enrolledAt).format('LL')}</Space>
          )}
        />
        <Table.Column
          title="Email"
          dataIndex="learner.email"
          key="learner.email"
          render={(_: any, record: Types.EnrolledCourse) =>
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
          render={(_: any, record: Types.EnrolledCourse) => {
            return (
              <Space>
                <Button
                  onClick={() => {
                    confirm({
                      title: 'Are you sure?',
                      // icon: <ExclamationCircleOutlined />,
                      content: `You want to refund this course to the user`,
                      onOk() {
                        removeLearnerFromCourse({
                          courseId: props.courseId,
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
                label: `Refund Course`,
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

export default CourseLearners
