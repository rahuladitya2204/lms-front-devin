import { Button, Card, Col, Modal, Row, Space, Spin, Table, Upload } from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import Header from '@Components/Header'
import MoreButton from '@Components/MoreButton'
import NewsDetailScreen from './NewsDetailScreen'
import React from 'react'
// import PDFViewer from '@Components/PDFViewer'
import UploadNews from './UploadNews'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'

const PDFViewer = React.lazy(() => import('@Components/PDFViewer'))
const { confirm } = Modal

export default function NewsScreen() {
  const { data, isLoading: loadingNews } = User.Queries.useGetNews()
  const {
    mutate: deleteNews,
    isLoading: deletingNews
  } = User.Queries.useDeleteNews()
  const { openModal } = useModal()
  const message = useMessage()
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
            {' '}
            <Spin spinning={loadingNews || deletingNews}>
              {/* @ts-ignore */}
              <Table dataSource={data}>
                <Table.Column
                  title="Date"
                  dataIndex="date"
                  key="date"
                  render={(_: any, record: Types.News) => (
                    <Space size="middle">
                      {dayjs(record.date).format('LL')}
                    </Space>
                  )}
                />
                <Table.Column
                  title="View PDF"
                  dataIndex="pdf"
                  key="pdf"
                  render={(_: any, record: Types.News) => (
                    <Button
                      onClick={() => {
                        openModal(
                          <PDFViewer file={{ _id: record.file.file }} />,
                          {
                            width: 700,
                            lazy: true,
                            title: `News Paper: ${dayjs(record.date).format(
                              'LL'
                            )}`
                          }
                        )
                      }}
                      type="primary"
                      size="small"
                    >
                      View PDF
                    </Button>
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
                        },
                        {
                          label: 'Delete News',
                          onClick: () => {
                            confirm({
                              title: `Are you sure?`,
                              // icon: <ExclamationCircleOutlined />,
                              content: `You want to delete this news`,
                              onOk() {
                                deleteNews(
                                  {
                                    id: record._id + ''
                                  },
                                  {
                                    onSuccess: () => {
                                      message.open({
                                        type: 'success',
                                        content: 'News Delete Successfully'
                                      })
                                    }
                                  }
                                )
                              },
                              okText: 'Delete'
                            })
                          },
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
            </Spin>
          </Card>
        </Col>
      </Row>
    </Header>
  )
}
