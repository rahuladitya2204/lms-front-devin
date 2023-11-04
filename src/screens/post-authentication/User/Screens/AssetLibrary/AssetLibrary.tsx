import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Typography
} from 'antd'
import { Common, Store, Types } from '@adewaskar/lms-common'

import { DeleteOutlined } from '@ant-design/icons'
import FileTypeIcon from '@Components/FileTypeIcon'
import Header from '@User/Screens/UserRoot/UserHeader'
import MoreButton from '@Components/MoreButton'
import dayjs from 'dayjs'
import { unit } from 'mathjs'

const { Text } = Typography

function AssetLibraryScreen() {
  const { data, isFetching: loadingFiles } = Common.Queries.useGetFiles()
  const organisation = Store.useGlobal(s => s.organisation)
  const {
    mutate: deleteFile,
    isLoading: deletingFile
  } = Common.Queries.useDeleteFile()
  const { confirm } = Modal

  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={`Asset Library - ${Math.ceil(
          unit(organisation.storage.utilised, 'byte')
            .to('megabyte')
            .toJSON().value
        )} MB`}
      >
        <Row>
          <Col span={24}>
            <Table dataSource={data} loading={loadingFiles || deletingFile}>
              <Table.Column
                title=""
                dataIndex=""
                render={(_: any, record: { name: string, type: string }) => {
                  const fileType = record.type.split('/')[0]
                  return (
                    <Space size="middle">
                      <Text strong>
                        <FileTypeIcon iconType="outlined" fileType={fileType} />
                      </Text>
                    </Space>
                  )
                }}
              />
              <Table.Column
                title="Name"
                dataIndex="name"
                render={(_: any, record: { name: string, type: string }) => {
                  const name = record.name.split('/')[0]
                  const fileType = record.type.split('/')[0]
                  return (
                    <Space size="middle">
                      <Text strong>{name}</Text>
                    </Space>
                  )
                }}
              />
              <Table.Column
                title="File Type"
                dataIndex="type"
                key="type"
                render={(_: any, record: { type: string }) => {
                  const type = record.type.split('/')[0]
                  return (
                    <Space size="middle">
                      <Text strong>{type}</Text>
                    </Space>
                  )
                }}
              />
              <Table.Column
                title="Size"
                dataIndex="size"
                key="size"
                render={(_: any, record: { size: number }) => {
                  const size = Math.ceil(
                    unit(record.size, 'byte')
                      .to('megabyte')
                      .toJSON().value
                  )
                  return (
                    <Space size="middle">
                      <Text strong>{size} MB</Text>
                    </Space>
                  )
                }}
              />
              <Table.Column
                title="Modified On"
                dataIndex="updatedAt"
                key="updatedAt"
                render={(_: any, record: { updatedAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.updatedAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Created On"
                dataIndex="createdAt"
                key="createdAt"
                render={(_: any, record: { createdAt: string }) => (
                  <Space size="middle">
                    {dayjs(record.createdAt).format('LLLL')}
                  </Space>
                )}
              />
              <Table.Column
                title="Created By"
                key="createdBy"
                render={(
                  _: any,
                  record: { createdBy: Types.User, _id: string }
                ) => <Space size="middle">{record?.createdBy?.name}</Space>}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.Instructor) => (
                  <MoreButton
                    items={[
                      {
                        label: 'Delete File',
                        key: 'delete',
                        onClick: () => {
                          confirm({
                            title: 'Are you sure?',
                            // icon: <ExclamationCircleOutlined />,
                            content: `You want to delete this file`,
                            onOk() {
                              deleteFile({ id: record._id })
                            },
                            okText: 'Delete'
                          })
                        }
                      }
                    ]}
                  />
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default AssetLibraryScreen
