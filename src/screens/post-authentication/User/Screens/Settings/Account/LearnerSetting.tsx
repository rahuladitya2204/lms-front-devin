import { Button, Card, Col, Form, Input, Row, Select } from 'antd'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import InputTags from '@Components/InputTags/InputTags'
import { useEffect } from 'react'

interface LearnerSettingPropsI {}

export default function LearnerSetting(props: LearnerSettingPropsI) {
    const [form] = Form.useForm();
    const { data: categories} = User.Queries.useGetProductCategories('all');
    const { data: orgSetting, isLoading } = User.Queries.useGetOrgSetting();
    const { mutate: updateOrgSetting,isLoading: updatingSetting} = User.Queries.useUpdateOrgSetting();
    useEffect(
        () => {
            form.setFieldsValue(orgSetting.learner)
        },
        [orgSetting]
    );
    const onSubmit = (data: any) => {
        console.log(data, 'aaa')
        // return;
        updateOrgSetting({
            data: {
                learner: data
            }
        })
    }
  return (
      <Form onFinish={onSubmit} form={form}>
          <Row gutter={[20,30]} >
              <Col span={24}>
              <Card title='Authentication' >
              <Form.Item name={['register','type']} >
              <Select placeholder="Select Register Strategy">
              <Select.Option key={Enum.LearnerRegisterType.LAZY} value={Enum.LearnerRegisterType.LAZY}>
                                                    Lazy
                      </Select.Option>
                      <Select.Option key={Enum.LearnerRegisterType.STRICT} value={Enum.LearnerRegisterType.STRICT}>
                                                    Strict
                        </Select.Option>
                                            </Select>
              </Form.Item>
          </Card>
        </Col>
              <Col span={24}>
              <Card title="Interests">
      <Form.List name="interests">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name }) => (
                                <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                    <Col span={10}>
                                        <Form.Item
                                            name={[name, 'title']}
                                            rules={[{ required: true, message: 'Please input title!' }]}
                                        >
                                            <Input placeholder="Title" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item
                                            name={[name, 'category']}
                                            rules={[{ required: true, message: 'Please select a category!' }]}
                                        >
                                            <Select mode='tags' placeholder="Select a category">
                                                {categories.map(category => (
                                                    <Select.Option key={category._id} value={category._id}>
                                                        {category.title}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                    </Col>
                                </Row>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Interest
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
      </Card>
              </Col>
              <Col span={24}>
                  <Button type='primary' loading={updatingSetting}  onClick={form.submit}>Submit</Button>
              </Col>
    </Row>
    </Form>
  )
}
