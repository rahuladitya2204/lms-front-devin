import { Button, Card, Space, Table } from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateWebsitePage from './CreateWebsitePage'
import { DeleteOutlined } from '@ant-design/icons'
import { Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { capitalize } from 'lodash'
import dayjs from 'dayjs'

interface WebsitePagesPropsI {
  //   courseId: string;
}

function WebsitePages(props: WebsitePagesPropsI) {
  const {
    data: { pages },
    isLoading: loading
  } = User.Queries.useGetWebsiteDetails()
  return (
    <Card
      title="Website Pages"
      extra={[
        <ActionModal cta={<Button>Add Website Page</Button>}>
          <CreateWebsitePage />
        </ActionModal>
      ]}
    >
      <Table dataSource={pages} loading={loading}>
        <Table.Column
          title="Title"
          dataIndex="title"
          render={(_: any, record: Types.WebsitePage) =>
            capitalize(record.title)
          }
        />
        <Table.Column
          title="URL"
          dataIndex="url"
          render={(_: any, record: Types.WebsitePage) => capitalize(record.url)}
        />
        <Table.Column
          title="Last Updated At"
          dataIndex="updatedAt"
          key="updatedAt"
          render={(_: any, record: Types.WebsitePage) => (
            //@ts-ignore
            <Space size="middle">{dayjs(record.updatedAt).format('LL')}</Space>
          )}
        />

        <Table.Column
          title="Customize"
          render={(_: any, record: Types.Learner) => (
            <Button size="small">Edit</Button>
          )}
        />

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

export default WebsitePages
