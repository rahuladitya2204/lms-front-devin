import {
  Button,
  Card,
  Col,
  Collapse,
  DatePicker,
  Divider,
  Input,
  Row,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { Types, User } from '@adewaskar/lms-common'

import Segmented from '@Components/Segmented'
import dayjs from 'dayjs'
import {
  InfoCircleFilled,
  QuestionCircleFilled,
  QuestionCircleTwoTone,
  UserOutlined
} from '@ant-design/icons'

interface DripSectionPropsI {
  section: Types.CourseSection;
  updateSection: (section: Types.CourseSection) => void;
}

const OPTIONS = [
  { label: 'Days after enrollment', value: 'days' },
  { label: 'Specific Date', value: 'date' }
]

function DripSection({ section, updateSection }: DripSectionPropsI) {
  const drip = section.drip
  const updateDrip = (d: any) => {
    const updatedSection: Types.CourseSection = {
      ...section,
      drip: {
        ...section.drip,
        ...d
      }
    }
    updateSection(updatedSection)
  }

  const updateAfter = (activateAfter: any) => {
    const updatedSection: Types.CourseSection = {
      ...section,
      drip: {
        ...section.drip,
        activateAfter: {
          ...section.drip.activateAfter,
          ...activateAfter
        }
      }
    }
    updateSection(updatedSection)
  }
  const isDripEnabled = !!section?.drip?.enabled
  return (
    <Card
      bodyStyle={{ padding: isDripEnabled ? 24 : 0 }}
      title={section.title}
      extra={[
        <Button size="small">Set Email Announcement</Button>,
        !isDripEnabled ? (
          <Button
            size="small"
            onClick={() => {
              updateDrip({
                enabled: true,
                activateAfter: {
                  type: `days`
                }
              })
            }}
            style={{ marginLeft: 20 }}
            type="primary"
          >
            Activate
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => {
              updateDrip({
                enabled: false
              })
            }}
            style={{ marginLeft: 20 }}
            danger
          >
            Deactivate
          </Button>
        )
      ]}
    >
      {section.drip?.enabled ? (
        <Row>
          {/* <Col span={24}>
            <Collapse
              collapsible="header"
              defaultActiveKey={['1']}
              items={[
                {
                  key: '1',
                  label: 'This panel can only be collapsed by clicking text',
                  children: <p>{text}</p>
                }
              ]}
            />
          </Col> */}
          <Col span={16}>
            <Row>
              <Col span={24}>
                Release by{' '}
                <Segmented
                  value={section.drip?.activateAfter?.type}
                  size="small"
                  options={OPTIONS}
                  onChange={e => {
                    updateAfter({
                      type: e,
                      value: null
                    })
                  }}
                />
              </Col>
              <Col span={24}>
                {drip?.activateAfter?.type === 'days' ? (
                  <Space style={{ marginTop: 20 }}>
                    <Input
                      onChange={e => {
                        updateAfter({
                          value: e.target.value
                        })
                      }}
                      value={drip?.activateAfter?.value}
                      type="number"
                      style={{ width: 70 }}
                    />
                    <strong>days after student enrolls(UTC)</strong>
                  </Space>
                ) : (
                  <Space style={{ marginTop: 20 }}>
                    <DatePicker
                      format={'LL'}
                      onChange={e => {
                        updateAfter({
                          value: e
                        })
                      }}
                      // @ts-ignore
                      value={
                        drip?.activateAfter?.value
                          ? dayjs(drip?.activateAfter?.value)
                          : null
                      }
                      style={{ width: 150 }}
                    />{' '}
                    <strong>should be released(UTC)</strong>
                  </Space>
                )}
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row justify={'center'} align={'middle'}>
              <Col span={4}>
                <UserOutlined style={{ fontSize: 30 }} />
              </Col>
              <Col span={20}>
                <Row>
                  <Col span={24}>
                    <Typography.Text strong>0 Students</Typography.Text>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>Have access</Typography.Text>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider />
            <Row justify={'center'} align={'middle'}>
              <Col span={4}>
                <UserOutlined style={{ fontSize: 30 }} />
              </Col>
              <Col span={20}>
                <Row>
                  <Col span={24}>
                    <Typography.Text strong>0 Students</Typography.Text>
                  </Col>
                  <Col span={24}>
                    <Typography.Text>
                      dont have access{' '}
                      <Tooltip title={`Mujhe bhi nahi pata`}>
                        <QuestionCircleTwoTone />
                      </Tooltip>{' '}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      ) : null}
    </Card>
  )
}

export default DripSection
