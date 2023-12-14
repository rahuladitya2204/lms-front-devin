import { Button, Checkbox, Col, DatePicker, Form, Input, Row } from 'antd'
import { MinusCircleOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'

import AppImage from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { Types } from '@adewaskar/lms-common'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'

interface AddBannerProps {
  banner?: Types.BannerSetting;
  onSave: (banner: Types.BannerSetting) => void;
  closeModal?: Function;
}

export default function AddBanner({ banner, onSave,closeModal }: AddBannerProps) {
  const [form] = Form.useForm<Types.BannerSetting>()

    useEffect(
      () => {
        if (banner?._id) {
          const B:Types.BannerSetting = cloneDeep(banner);
          if (B.display.from) {
            // @ts-ignore
            B.display.from=dayjs(B.display.from)
          }
          if (B.display.to) {
                        // @ts-ignore
            B.display.to=dayjs(B.display.to)
          }
          form.setFieldsValue(B)
        }
      },
      [banner, form]
    )

  const onFinish = (values: Types.BannerSetting) => {
    onSave(values);
    closeModal && closeModal();

  }
  const displayOnce = Form.useWatch(['display', 'once'], form);
  const image = Form.useWatch('image', form);
  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="image"
        rules={[{ required: true, message: 'Please input image URL!' }]}
      >
        <MediaUpload
          name={['image']}
          uploadType="image"
          cropper
          // width="100%"
          height="100px"
          aspect={16 / 9}
          renderItem={() => (
            <AppImage
              width={100}
              height={100}
              preview={false}
                src={image}
            />
          )}
          onUpload={file => {
            form.setFieldValue(['image'], file.url)
          }}
        />
      </Form.Item>
      <Form.Item name={['display', 'once']} valuePropName="checked">
        <Checkbox>Display Once</Checkbox>
      </Form.Item>
      {!displayOnce ? (
        <Row gutter={[10, 20]}>
          <Col span={12}>
            <Form.Item
              label="Display from"
              name={['display', 'from']}
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Display From"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Display to"
              name={['display', 'to']}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Display To" />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
      <Form.List name="ctas">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={10}>
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    rules={[{ required: true, message: 'Please input CTA label!' }]}
                  >
                    <Input placeholder="CTA Label" />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item
                    {...restField}
                    name={[name, 'action']}
                    rules={[{ required: true, message: 'Please input CTA action!' }]}
                  >
                    <Input placeholder="CTA Action" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button danger
                    // type="danger"
                    onClick={() => remove(name)}
                    icon={<MinusCircleOutlined />}
                  />
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add CTA
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}
