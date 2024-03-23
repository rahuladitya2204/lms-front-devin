import {
  Button,
  Card,
  Col,
  Dropdown,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Upload
} from 'antd'
import { Types, User } from '@invinciblezealorg/lms-common'

import ActionModal from '@Components/ActionModal/ActionModal'
import AddUser from './AddUserToOrg'
import CreateOrganisation from './CreateOrganisation'
import Header from '@Components/Header'
import MoreButton from '@Components/MoreButton'
import React from 'react'
import dayjs from 'dayjs'
import useMessage from '@Hooks/useMessage'
import { useModal } from '@Components/ActionModal/ModalContext'

// import PDFViewer from '@Components/PDFViewer'

const PDFViewer = React.lazy(() => import('@Components/PDFViewer'))
const { confirm } = Modal

export default function OrganisationScreen() {
  const {
    data,
    isLoading: loadingOrganisation
  } = User.Queries.useGetOrganisations()
  //   const {
  //     mutate: deleteOrganisation,
  //     isLoading: deletingOrganisation
  //   } = User.Queries.useDeleteOrganisation()
  const { openModal } = useModal()
  const message = useMessage()
  console.log(data, 'ddd')
  return (
    <Header
      title="Organisation"
      extra={
        <ActionModal
          title="Upload Organisation Paper"
          cta={<Button>Create Organisation</Button>}
        >
          <CreateOrganisation />
        </ActionModal>
      }
    >
      <Row>
        <Col span={24}>
          <Card loading={loadingOrganisation}>
            {' '}
            <Spin spinning={false}>
              {/* @ts-ignore */}
              <Table dataSource={data}>
                <Table.Column title="Name" dataIndex="name" key="name" />
                {/* <Table.Column
                  title="View PDF"
                  dataIndex="pdf"
                  key="pdf"
                  render={(_: any, record: Types.Organisation) => (
                    <MoreButton
                      items={record.files.map(({ url, file }, index) => {
                        return {
                          label: `View PDF: ${index + 1}`,
                          key: file,
                          onClick: () => {
                            openModal(<PDFViewer file={{ _id: file }} />, {
                              width: 700,
                              lazy: true,
                              title: `Organisation Paper: ${dayjs(
                                record.date
                              ).format('LL')}`
                            })
                          }
                        }
                      })}
                    />
                  )}
                /> */}
                {/* <Table.Column
                  title="Publication"
                  dataIndex="publication"
                  key="publication"
                  render={(_: any, record: Types.Organisation) => (
                    <Space size="middle">{record.publication}</Space>
                  )}
                /> */}
                <Table.Column
                  title="Action"
                  key="action"
                  render={(
                    _: any,
                    record: Types.Organisation,
                    index: number
                  ) => (
                    <MoreButton
                      items={[
                        // {
                        //   label: 'Generate Summary',
                        //   onClick: () =>
                        //     summarizeOrganisation(
                        //       { id: record._id + '' },
                        //       {
                        //         onSuccess: () => {
                        //           message.open({
                        //             type: 'success',
                        //             content: 'Summaring Initiated'
                        //           })
                        //         }
                        //       }
                        //     ),
                        //   key: 'summarize'
                        // },
                        // {
                        //   label: 'View Summary',
                        //   onClick: () =>
                        //     openModal(
                        //       <OrganisationDetailScreen data={record} />,
                        //       {
                        //         title: `${dayjs(record.date).format(
                        //           'LL'
                        //         )} news`,
                        //         width: 700
                        //       }
                        //     ),
                        //   key: 'view'
                        // },
                        // {
                        //   label: 'Delete Organisation',
                        //   onClick: () => {
                        //     confirm({
                        //       title: `Are you sure?`,
                        //       // icon: <ExclamationCircleOutlined />,
                        //       content: `You want to delete this news`,
                        //       onOk() {
                        //         deleteOrganisation(
                        //           {
                        //             id: record._id + ''
                        //           },
                        //           {
                        //             onSuccess: () => {
                        //               message.open({
                        //                 type: 'success',
                        //                 content:
                        //                   'Organisation Delete Successfully'
                        //               })
                        //             }
                        //           }
                        //         )
                        //       },
                        //       okText: 'Delete'
                        //     })
                        //   },
                        //   key: 'delete'
                        // }
                        {
                          label: 'Edit Organisation',
                          onClick: () =>
                            openModal(<CreateOrganisation data={record} />, {
                              title: 'Edit Organisation'
                            }),
                          key: 'edit'
                        },
                        {
                          label: 'Add User',
                          onClick: () =>
                            openModal(<AddUser organisation={record._id} />, {
                              title: 'Add User'
                            }),
                          key: 'add-user'
                        }
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
