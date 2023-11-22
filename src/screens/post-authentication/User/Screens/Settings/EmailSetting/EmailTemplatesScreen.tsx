// @ts-nocheck
import { Button, Card, Col, Row, Select, Space, Table, Tag } from 'antd'
import { Common, Types } from '@adewaskar/lms-common'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

import ActionModal from '@Components/ActionModal/ActionModal'
import { EmailTemplateStatusMap } from '@User/Screens/Marketing/Templates/Constant'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import { useNavigate } from 'react-router'
import { useState } from 'react'

function EmailTemplatesScreen() {
  // @ts-ignore
  const { data: { EmailTemplatesMap } } = Common.Queries.useGetAppConfig('user')

  const navigate = useNavigate()
  const { data, isFetching: loading } = User.Queries.useGetEmailTemplates()
  return (
    <Row>
      <Col span={24}>
        <Table
          dataSource={data.filter(r => r.type === 'default')}
          loading={loading}
        >
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
              <Space size="middle">
                <EditOutlined
                  onClick={() =>
                    window.open(`../email-templates/${record._id}/editor`)
                  }
                />
                {/* <DeleteOutlined /> */}
              </Space>
            )}
          />
        </Table>
      </Col>
    </Row>
  )
}

export default EmailTemplatesScreen
