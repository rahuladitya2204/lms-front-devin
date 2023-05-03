import { Button, Card, Col, Row, Select, Space, Table, Tag } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddWhatsappTemplate from './AddWhatsappTemplate'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import { WhatsappTemplateStatusMap } from '../Constant'
import { useNavigate } from 'react-router'
import { useState } from 'react'

function WhatsappTemplatesScreen() {
  const navigate = useNavigate();
  const { data, isLoading: loading } = User.Queries.useGetWhatsappTemplates()
  const [type, setType] = useState('default')
  return (
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Whatsapp Templates'}
        extra={
          <>
            {type==='custom'?<ActionModal
          title="Create Whatsapp Template"
          cta={
            <Button style={{marginRight: 20}} icon={<PlusOutlined />} type="primary">
              Create Custom Template
            </Button>
          }
        >
          <AddWhatsappTemplate> </AddWhatsappTemplate>
        </ActionModal>:null}

          </>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={data}
              loading={loading}
            >

            <Table.Column
                  title="Template Name"
                  dataIndex="title"
                  key="title"
                  render={(_: any, record: Types.WhatsappTemplate) => (
                    <Space size="middle">{record.name}</Space>
                  )}
            />
     
     <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.WhatsappTemplate) => (
                  <Space size="middle">
                    {/* @ts-ignore */}
                    <Tag color={WhatsappTemplateStatusMap[record.status].color}>
                    {/* @ts-ignore */}
                    {WhatsappTemplateStatusMap[record.status].title}
                    </Tag>
                  </Space>
                )}
              />
            
            <Table.Column
                title="Category"
                dataIndex="category"
                key="category"
              />


              <Table.Column
                title="Total Sent"
                dataIndex="totalSent"
                key="totslSent"
              />


<Table.Column
                title="Success Rate"
                dataIndex="successCount"
                key="successCount"
              />

<Table.Column
                title="Failure Rate"
                dataIndex="failureCount"
                key="failureCount"
              />
              
              {/* <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.WhatsappTemplate) => (
                  <Space size="middle">
                    <Tag color={WhatsappTemplateStatusMap[record.status].color}>
                      {WhatsappTemplateStatusMap[record.status].title}
                    </Tag>
                  </Space>
                )}
              /> */}
              <Table.Column
                title=""
                key="action"
                render={(_: any, record: Types.WhatsappTemplate) => (
                  <Space size="middle">
                    <EditOutlined
                      onClick={() =>
                       navigate(`${record._id}/editor`)
                      }
                    />
                    {/* <DeleteOutlined /> */}
                  </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>

  )
}

export default WhatsappTemplatesScreen
