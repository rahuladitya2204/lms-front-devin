import { Button, Modal, Rate, Space } from 'antd'
import Table, { TableColumn } from '@Components/Table/TableComponent'

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
  const {
    data,
    isLoading: loading
  } = User.Queries.useGetEnrolledProductLearners(props.testId + '')

  const {
    mutate: removeLearnerFromTest
  } = User.Queries.useRemoveLearnerFromCourse()

  return (
    <Container title="Enrolled Learners" extra={[<Button>Add Learner</Button>]}>
      <Table
        searchFields={['name']}
        dataSource={data} loading={loading}>
        <TableColumn
          title="Name"
          dataIndex="name"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            capitalize(record.learner.name)
          }
        />
        <TableColumn
          title="Enrolled At"
          dataIndex="email"
          key="email"
          render={(_: any, record: Types.EnrolledProductDetails) => (
            <Space size="middle">{dayjs(record.enrolledAt).format('LL')}</Space>
          )}
        />
        <TableColumn
          title="Email"
          dataIndex="learner.email"
          key="learner.email"
          render={(_: any, record: Types.EnrolledProductDetails) =>
            // @ts-ignore
            record.learner.email
          }
        />
        {/* <TableColumn
title="Last Login"
dataIndex="lastActive"
key="lastActive"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.lastActive).format('LLLL')}</Space>
)}
/>
<TableColumn
title="Joined On"
dataIndex="createdAt"
key="createdAt"
render={(_: any, record: Types.Learner) => (
  <Space size="middle">{dayjs(record.createdAt).format('LL')}</Space>
)}
/> */}
        <TableColumn
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
                      content: `You want to refund this test to the user`,
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
        <TableColumn
          title="Rating"
          dataIndex="rating"
          key="rating"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            const review = record?.review as unknown as Types.ProductReview;
            return (
              <Rate disabled allowHalf defaultValue={review?.rating} />
            )
          }}
        />
        <TableColumn
          title="Rating Comment"
          dataIndex="createdAt"
          key="createdAt"
          render={(_: any, record: Types.EnrolledProductDetails) => {
            const review = record?.review as unknown as Types.ProductReview;
            return review?.comment?(
              <Space size="middle">{review?.comment}</Space>
            ):'-'
          }}
        />
      </Table>
    </Container>
  )
}

export default TestLearners
