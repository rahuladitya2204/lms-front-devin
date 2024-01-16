import { Button, Card, Col, Row, Space, Table, Upload } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import Header from '@Components/Header'
import MoreButton from '@Components/MoreButton'
import NewsDetailScreen from './NewsDetailScreen'
import UploadNews from './UploadNews'
import dayjs from 'dayjs'
import { useModal } from '@Components/ActionModal/ModalContext'

export default function NewsScreen() {
  const { data } = User.Queries.useGetNews()
  const { openModal } = useModal()
  console.log(data, 'ddd')
  return (
    <Header
      title="News"
      extra={
        <ActionModal
          title="Upload News Paper"
          cta={<Button>Upload News</Button>}
        >
          <UploadNews />
        </ActionModal>
      }
    >
      <Row>
        <Col span={24}>
          <Card>
            {/* @ts-ignore */}
            <Table dataSource={data}>
              <Table.Column
                title="Date"
                dataIndex="date"
                key="date"
                render={(_: any, record: Types.News) => (
                  <Space size="middle">{dayjs(record.date).format('LL')}</Space>
                )}
              />
              <Table.Column
                title="Publication"
                dataIndex="publication"
                key="publication"
                render={(_: any, record: Types.News) => (
                  <Space size="middle">{record.publication}</Space>
                )}
              />
              <Table.Column
                title="Action"
                key="action"
                render={(_: any, record: Types.News, index: number) => (
                  <MoreButton
                    items={[
                      {
                        label: 'View Summary',
                        onClick: () =>
                          openModal(<NewsDetailScreen data={record} />, {
                            title: `${dayjs(record.date).format('LL')} news`,
                            width: 700
                          }),
                        key: 'view'
                      }
                      // {
                      //   label: 'Edit Category',
                      //   onClick: () =>
                      //     openModal(<UploadNews data={record} />, {
                      //       title: 'Edit Category'
                      //     }),
                      //   key: 'edit'
                      // }
                    ]}
                  />
                )}
              />
            </Table>
          </Card>
        </Col>
      </Row>
    </Header>
  )
}
