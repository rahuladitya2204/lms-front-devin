import { Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Enum, Types, User } from '@invinciblezealorg/lms-common'
import { Fragment, useEffect } from 'react'

import ActionModal from '@Components/ActionModal/ActionModal';
import AddBanner from './AddBanner';
import AppImage from '@Components/Image';
import InputTags from '@Components/InputTags/InputTags'
import dayjs from 'dayjs';

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
    const banners = Form.useWatch('banners', form);
    const handleDeleteBanner = (key: string) => {
                                    // @ts-ignore

        const updatedBanners = banners.filter((banner: Types.BannerSetting) => banner._id !== key);
        form.setFieldsValue({ banners: updatedBanners });
    };


  return (
      <Form onFinish={onSubmit} form={form}>
          <Row gutter={[20, 30]} >
          <Col span={24}>
                  <Card title="Banners"
                      extra={<ActionModal
                          title='Add Banners'
                          cta={<Button type='primary' >Add banner</Button>}>
                          <AddBanner onSave={(banner) => {
                              let banners = form.getFieldValue(['banners']);
                              if (banner.ctas) {
                                  banner.ctas = [];
                              }
                              if (banner.display.from) {
                                //   @ts-ignore
                                  banner.display.from = banner.display.from.toDate();
                              }
                              if (banner.display.to) {
                                                                  //   @ts-ignore
                                banner.display.to = banner.display.to.toDate();
                            }
                              if (!banners) {
                                  banners = [];
                              }
                              if (banner._id) {
                                banners.push(banner)
                              } else {
                                //   @ts-ignore
                                  banners.forEach((b,index) => {
                                      if (b._id === banner._id) {
                                          banners[index] = banner;
                                    }
                                })
                              }
                              console.log(banners,'taaa')
                              form.setFieldValue(['banners'], banners);
                              form.submit();
                          }} />
                      </ActionModal>}>
                      <Form.Item name='banners' />
                                <Row gutter={[16, 16]}>
                {form.getFieldValue('banners')?.map((banner: Types.BannerSetting, index: number) => (
                    <Col key={index} span={24}>
                        <Card bordered={false}>
                            <Row >
                                <Col span={24}>
                                <Table
                dataSource={form.getFieldValue('banners')}
                columns={[
                    {
                        title: 'Image',
                        dataIndex: 'image',
                        key: 'image',
                        render: (text: string) => <AppImage preview src={text} width={100} height={100} />
                    },
                    {
                        title: 'Display Period',
                        dataIndex: 'display',
                        key: 'display',
                        render: (display: { from: Date; to: Date }) => `${dayjs(display?.from).format('LL')} - ${dayjs(display?.to).format('LL')}`
                    },
                    {
                        title: 'CTAs',
                        dataIndex: 'ctas',
                        key: 'ctas',
                        render: (ctas: { label: string, action: string }[]) => (
                            <>
                                {ctas.map((cta, index) => (
                                    <Tag color="blue" key={index}>{cta.label}</Tag>
                                ))}
                            </>
                        )
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        render: (_: any, record: Types.BannerSetting) => (
                            // @ts-ignore
                            <Space>
                                                            <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteBanner(record._id+'')} />
                                <ActionModal cta={<Button type="link" icon={<EditOutlined />} />}>
                                    <AddBanner onSave={console.log} banner={record} />
                            </ActionModal>

                                
</Space>                            )
                    }
                    // Add more columns if needed
                ]}
                rowKey="key"
            />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>

                    </Card>
                </Col>

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
                              <Select.Option key={Enum.LearnerRegisterType.INVITE_ONLY}
                                  value={Enum.LearnerRegisterType.INVITE_ONLY}>
                                                    Invite Only
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
