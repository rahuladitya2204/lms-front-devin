import { Button, Card, Col, Form, Input, Row, Select } from 'antd'
import { Enum, User } from '@adewaskar/lms-common'
import { Fragment, useCallback, useMemo } from 'react'

import AppImage from '@Components/Image'
import { DeleteOutlined } from '@ant-design/icons'
import InputTags from '@Components/InputTags/InputTags'
import MediaUpload from '@Components/MediaUpload'
import ProductCard from '@Components/ProductCard'
import ProductRow from './Products/ProductRow'
import SelectProductCategory from '@Components/SelectProductCategory'
import TextArea from '@Components/Textarea'

interface PackageDetailsPropsI {
  packageId: string;
}

export default function PackageDetails(props: PackageDetailsPropsI) {
  const form = Form.useFormInstance()
  const { packageId } = props
  const image = Form.useWatch('thumbnailImage', form)

  return (
    <Fragment>
      <Row gutter={[20, 20]}>
        <Col span={16}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter a title of the packages'
              }
            ]}
            name="title"
            label="Package Title"
            required
          >
            <Input placeholder="Enter a title for the live session" />
          </Form.Item>
          <Row gutter={[20, 20]}>
            <Col span={12}>
              <SelectProductCategory name="category" />
            </Col>
            <Col span={12}>
              <InputTags label="Keywords" name="keywords" />
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Form.Item name={'thumbnailImage'}>
            <MediaUpload
              name={'thumbnailImage'}
              source={{
                type: 'package.thumbnail',
                value: packageId + ''
              }}
              uploadType="image"
              // prefixKey={`packages/${packageId}/image`}
              cropper
              width="100%"
              // height="200px"
              aspect={16 / 9}
              renderItem={() => <AppImage preview={false} src={image} />}
              onUpload={file => {
                console.log(file, 'uploaded image!')
                form.setFieldValue('thumbnailImage', file.url)
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter a description of the packages'
              }
            ]}
            name={['description']}
            required
          >
            <TextArea
              height={250}
              html
              label="Description"
              name={['description']}
            />
          </Form.Item>
        </Col>
      </Row>
    </Fragment>
  )
}
