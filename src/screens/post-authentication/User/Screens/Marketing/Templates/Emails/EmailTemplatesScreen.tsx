// @ts-nocheck
import { Button, Card, Col, Row, Select, Space, Table, Tag } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal'
import AddEmailTemplate from './CreateEmailTemplate'
import { EmailTemplateStatusMap } from './Constant'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import MoreButton from '@Components/MoreButton'

function EmailTemplatesScreen() {
  // @ts-ignore
  const { data: { EmailTemplatesMap } } = Common.Queries.useGetAppConfig('user')

  const navigate = useNavigate();
  const { data, isLoading: loading } = User.Queries.useGetEmailTemplates()
  const [type, setType] = useState('default')
  return (
    <Header>
      <Card
        bodyStyle={{ padding: 0 }}
        title={'Email Templates'}
        extra={
          <>
            {type==='custom'?<ActionModal
          title="Create Email Template"
          cta={
            <Button style={{marginRight: 20}} icon={<PlusOutlined />} type="primary">
              Create Custom Template
            </Button>
          }
        >
          <AddEmailTemplate> </AddEmailTemplate>
        </ActionModal>:null}
        <Select
          defaultValue="default"
          style={{ width: 200 }}
          onChange={e => setType(e)}
          options={[
            { value: 'default', label: 'Default Templates' },
            { value: 'custom', label: 'Custom Templates' }
          ]}
        /></>
        }
      >
        <Row>
          <Col span={24}>
            <Table
              dataSource={data.filter(r => r.type === type)}
              loading={loading}
            >
              {type === 'custom' ? (
                <Table.Column
                  title="Template Title"
                  dataIndex="title"
                  key="title"
                  render={(_: any, record: Types.EmailTemplate) => (
                    <Space size="middle">{record.title}</Space>
                  )}
                />
              ) : (
                <Table.Column
                  title="Mail Type"
                  dataIndex="emailType"
                  key="emailType"
                  render={(_: any, record: Types.EmailTemplate) => (
                    <Space size="middle">
                      {EmailTemplatesMap[record.emailType]?.title}
                    </Space>
                  )}
                />
              )}

              <Table.Column
                title="Description"
                dataIndex="description"
                key="description"
                render={(_: any, record: Types.EmailTemplate) => (
                  <Space size="middle">
                    {EmailTemplatesMap[record.emailType]?.description}
                  </Space>
                )}
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
              
              <Table.Column
                title="Status"
                dataIndex="status"
                key="status"
                render={(_: any, record: Types.EmailTemplate) => (
                  <Space size="middle">
                    <Tag color={EmailTemplateStatusMap[record.status].color}>
                      {EmailTemplateStatusMap[record.status].title}
                    </Tag>
                  </Space>
                )}
              />
              <Table.Column
                title=""
                key="action"
                render={(_: any, record: Types.EmailTemplate) => (
                  <MoreButton items={[{
                    key: 'edit',
                    label: 'Edit Template',
                    icon: <EditOutlined />,
                    onClick: () =>
                    navigate(`${record._id}/editor`)
                  }]}></MoreButton>
                  
                  // <Space size="middle">
                  //   <EditOutlined
                      // onClick={() =>
                      //  navigate(`${record._id}/editor`)
                      // }
                  //   />
                  // </Space>
                )}
              />
            </Table>
          </Col>
        </Row>
      </Card>
    </Header>
  )
}

export default EmailTemplatesScreen
