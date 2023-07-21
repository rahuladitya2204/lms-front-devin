import { Button, Card, Space, Table } from 'antd'

import { DeleteOutlined } from '@ant-design/icons'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'

interface CourseLearnersPropsI {
  courseId: string;
}

function CourseLearners(props: CourseLearnersPropsI) {
  const { data, isLoading: loading } = User.Queries.useGetCourseLearners(
    props.courseId + ''
  )
  return (
    <Card title='Course Learners' extra={[<Button>Add Learner</Button>]}> 
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
          render={(_: any, record: Types.Learner) => (
            <Space size="middle">
              {/* <EditOutlined
            onClick={() =>
              window.open(`learners/${record._id}/editor`, '_blank')
            }
          /> */}
              <DeleteOutlined />
            </Space>
          )}
        />
      </Table>
    </Card>
  )
}

export default CourseLearners
