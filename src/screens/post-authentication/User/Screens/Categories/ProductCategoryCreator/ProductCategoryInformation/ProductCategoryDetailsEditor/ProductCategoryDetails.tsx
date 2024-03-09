import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect
} from 'antd'
import { Enum, Types, User } from '@adewaskar/lms-common'
import { useEffect, useMemo } from 'react'

import FileList from '@Components/FileList'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import { PlusOutlined } from '@ant-design/icons'
import SelectProductCategory from '@Components/SelectProductCategory'
import TextArea from '@Components/Textarea'
import { Title } from '@Components/Typography/Typography'
import { TopicNode } from '@User/Screens/AssetLibrary/Topics/TopicsScreen'
import { Typography } from '@Components/Typography'
import { deepPatch } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import { useParams } from 'react-router'

const { Text } = Typography

const LANGUAGES = [
  {
    value: Enum.LanguageEnum.ENGLIGH,
    label: 'English'
  },
  {
    value: Enum.LanguageEnum.HINDI,
    label: 'Hindi'
  },
  {
    value: Enum.LanguageEnum.FRENCH,
    label: 'French'
  }
]
const { useWatch } = Form

interface ProductCategoryDetailsEditorPropsI {
  testId?: string;
  saveProductCategory: Function;
  productCategory: Types.ProductCategory;
}

function ProductCategoryDetailsEditor(
  props: ProductCategoryDetailsEditorPropsI
) {
  const { productCategory } = props
  const form = Form.useFormInstance();
  const { id } = useParams()
  const testId = props.testId || id
  const image = useWatch(['thumbnailImage'], form)
  return (
    <>
      {/* <Form.Item name={['status']} required label="ProductCategory Status">
        <Select style={{ width: 200 }} placeholder="Select Status`">
          {STATUSES.map((category: any) => {
            return (
              <Option
                key={category.value}
                value={category.value}
                label={category.label}
              >
                {category.label}
              </Option>
            )
          })}
        </Select>
      </Form.Item> */}
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          source={{
            type: 'productCategory.image',
            value: testId + ''
          }}
          uploadType="image"
          compress={{ quality: 0.8, maxHeight: 200, maxWidth: 330 }}
          cropper={{ width: 330, height: 200 }}
          aspect={16 / 9}
          name="thumbnailImage"
          width="200px"
          height="300px"
          prefixKey={`ProductCategorys/${testId}/thumbnailImage`}
          renderItem={() => <Image preview={false} src={image} />}
          onUpload={e => {
            form.setFieldValue(['thumbnailImage'], e.url);
          }}
        />
      </Form.Item>

      <Form.Item
        name="title"
        required
        label="Title"
        rules={[
          {
            required: true,
            message: 'Please enter a title for the ProductCategory'
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="subtitle"
        required
        label="Subtitle"
        rules={[
          {
            required: true,
            message: 'Please enter a subtitle for the ProductCategory'
          }
        ]}
      >
        <Input />
      </Form.Item>


      <Divider />
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','registration','date']}
            label="Registration Date"
            // required
          >
            <Input
              // type="string"
              placeholder="Please enter registration date"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','registration','link']}

            label="Registration Link"
            // required
          >
            <Input
              // type="number"
              placeholder="Please enter registration/application link"
            />
          </Form.Item>
        </Col>
        {/* <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','officialNotification','link']}
            label="Official Notification Link"
            // required
          >
            <Input
              // type="string"
              placeholder="Please enter official Notification Link"
            />
          </Form.Item>
        </Col> */}
      </Row>
      <Divider />
      <Row gutter={[40, 20]}>
      <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','eligibility']}
            label="Eligibility"
            // required
          >
            <Input
              // type="string"
              placeholder="Please enter eligibility"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','vacancies']}
            label="Vacancies"
            // required
          >
            <Input
              // type="string"
              placeholder="Please enter total vacancies"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name={['info','salaryRange']}

            label="Salary"
            // required
          >
            <Input
              // type="number"
              placeholder="Please enter Salary Range"
            />
          </Form.Item>
        </Col>
        <Col span={6}>
        <Form.Item name={['info','officialNotification','link']} required label="Oficial Notification">
        <MediaUpload
          uploadType="file" 
          cropper={{ width: 330, height: 200 }}
          name={['info','officialNotification','link']}
          onUpload={e => {
            form.setFieldValue(['info','officialNotification','link'], e.url);
          }}
            />
            {form.getFieldValue(['info', 'officialNotification', 'link']) ?
              <span>Notification File <span onClick={() => form.setFieldValue(['info','officialNotification','link'], null)}>X</span>
              </span> : null}
      </Form.Item>

        </Col>
      </Row>
      <Divider/>

    </>
  )
}

export default ProductCategoryDetailsEditor

