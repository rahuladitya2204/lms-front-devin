import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Table,
  Typography,
} from 'antd'
import { Enum, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import ActionModal from '@Components/ActionModal'
import AddProduct from './Products/AddProduct'
import CreatePlan from '@User/Screens/ExtraComponents/CreatePlan'
import Header from '@Components/Header'
import Image from '@Components/Image'
import LocationAutocomplete from '@Components/LocationSelector'
import LocationSelector from '@Components/LocationSelector'
import MediaUpload from '@Components/MediaUpload'
import PriceFormItem from '@Components/PriceFormItem'
import ProductRow from './Products/ProductRow'
import Products from './Products/Products'
import TextArea from '@Components/Textarea'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface CreatePackageComponentPropsI {
  // data: Types.Package;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Package) => void;
}

const { Text } = Typography;

const CreatePackage: React.FC<CreatePackageComponentPropsI> = props => {
  const { packageId } = useParams();
  const [products, setProducts] = useState<Types.Product[]>([]);
  const navigate = useNavigate();
  const {
    mutate: createPackage,
    isLoading: createPackageLoading
  } = User.Queries.useCreatePackage()
  const {
    mutate: updatePackage,
    isLoading: updatePackageLoading
  } = User.Queries.useUpdatePackage();


  const {data: packageDetails}=User.Queries.useGetPackageDetails(packageId+'',{
    enabled:!!packageId
  })
  useEffect(() => { 
    console.log(packageDetails,'packageDetailspackageDetails')
    form.setFieldsValue(packageDetails)
    // @ts-ignore
    if (packageDetails?.products?.length) {
      setProducts(products)
    }
  },[packageDetails])

  const [form] = Form.useForm<Types.Package>()

  const onSubmit = (e: Types.Package) => {
    const data= {
      ...e,
      products: products
    }
    if (packageId) {
      updatePackage(
        { id: packageId, data:data },
        {
          onSuccess: () => {
            form.resetFields();
            navigate('../')
            props.onSuccess && props.onSuccess();
            props.closeModal && props.closeModal();
          }
        }
      )
    } else {
      // @ts-ignore
      createPackage(
        { data:data },
         {
        onSuccess: () => {
          navigate('../')
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal()
        }
      })
    }
  }
  const image = Form.useWatch('thumbnailImage', form);
  const { data: promoCodes} = User.Queries.useGetPromos();
  return (
    <Header showBack title='Create Package' extra={[<Button
      loading={createPackageLoading || updatePackageLoading}
      key="submit"
      type="primary"
      onClick={form.submit}
      >
      Create Package
    </Button>
    ]}>
        <Card>
      <Row>
        <Col span={24}>
      <>
              <Form form={form} onFinish={onSubmit} layout="vertical">
                <Row gutter={[20,20]}>
                  <Col span={16}>
                  <Form.Item
        rules={[
          { required: true, message: 'Please enter a title of the packages' }
        ]}
        name="title"
        label="Package Title"
        required
      >
        <Input placeholder="Enter a title for the live session" />
      </Form.Item>
                  </Col>
                  <Col span={8}>
        <MediaUpload
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
                  renderItem={() => (
                    <Image preview={false} src={image} />
                  )}
                      onUpload={file => {
                    console.log(file,'uploaded image!')
                    form.setFieldValue('thumbnailImage', file.url)
                  }}
                />
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
        name={["description"]}
        required
      >
                      <TextArea height={250} html label="Description" name={["description"]} />
                      
                    </Form.Item>

                    <Form.List name="products">
                {(fields, { add, remove }) => (
                  <>
                  {fields.map(field => (
              <ProductRow form={form} key={field.key} name={field.name} remove={remove} />
            ))}
                    <Row>
                      <Col span={24}>
                        <Button type="dashed" onClick={() => add()} block>Add Product</Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Form.List>

                    
                  </Col>
      </Row>

    </Form>
            </>
        </Col>

    </Row>
    </Card>
    </Header>
  )
}

export default CreatePackage
