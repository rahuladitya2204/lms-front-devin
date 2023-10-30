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
import React, { Fragment, ReactNode, useEffect, useState } from 'react'

import ActionModal from '@Components/ActionModal'
import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import PriceFormItem from '@Components/PriceFormItem'
import TextArea from '@Components/Textarea'
import { Enum, Types } from '@adewaskar/lms-common'
import { User } from '@adewaskar/lms-common'
import { VideoCameraOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router'
import LocationSelector from '@Components/LocationSelector'
import LocationAutocomplete from '@Components/LocationSelector'
import AddProduct from './Products/AddProduct'
import Products from './Products/Products'
import CreatePlan from '@User/Screens/ExtraComponents/CreatePlan'

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


  const {data: packageDetails,isLoading: loadingPackage}=User.Queries.useGetPackageDetails(packageId+'',{
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
      Publish Package
    </Button>
    ]}>
        <Card loading={loadingPackage}>
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
                    {/* <Row gutter={[10, 10]}>
        <Col span={12}>
        <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter start time for the livestream'
              }
            ]}
            name="scheduledAt"
            label="Scheduled For"
            required
          >
            <DatePicker style={{width: '100%'}} value={date} showTime  />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            rules={[
              {
                required: true,
                message: 'Please enter duration of the Package'
              }
            ]}
            name="duration"
            label="Duration(mins)"
            required
          >
            <Input
              type="number"
              placeholder="Please enter duration in minutes"
            />
          </Form.Item>
        </Col>
      </Row> */}
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
                  </Col>
      <Col span={12}>
      <Form.Item name='promoCodes' label='Promo Codes'>
<Select
          options={promoCodes.map(pc=>({label: pc.code,value:pc._id}))}
        />
        </Form.Item>
          </Col>
      </Row>

                <Card actions={[<ActionModal cta={<Button>Add Plan</Button>}>
                  <CreatePlan product={{type:'package'}}/>
                </ActionModal>]}>
                <Row gutter={[20,20]}>
                  <Col span={12}>
                      <Text>{ }</Text>
          </Col>
          <Col span={12}>  <PriceFormItem name="price" label="Price" /></Col>
      </Row>
     </Card>
    </Form>
            </>
            <Card title='Add Product'
              extra={<ActionModal cta={<Button type='primary'>Add Product</Button>}>
              <AddProduct submit={(e) => {
                  console.log(e, 'e')
                  // @ts-ignore
                setProducts([...products, e]);
              }}/>
            </ActionModal>}>
              <Products deleteItem={(index:number) => {
                  const PRODUCTS = [...products];
                  PRODUCTS.splice(index,1)
                  setProducts(PRODUCTS);
                }}
                              // @ts-ignore
    products={products} submit={(index: number, e: Types.Product) => {
                const PRODUCTS = [...products];
                                // @ts-ignore
  PRODUCTS[index] = e;
                setProducts(PRODUCTS)
         }}  />
            </Card>
            {/* <Card title='Testimonials' extra={<ActionModal cta={<Button type='primary'>Add Testimonial</Button>}>
              <AddTestimonial submit={(e: Types.Testimonial) => {
                console.log(e,'e')
                setTestimonials([...testimonials, e]);
              }}/>
            </ActionModal>}>
              <PackageTestimonials deleteItem={index => {
                  const TESTIMONIALS = [...testimonials];
                  TESTIMONIALS.splice(index,1)
                setTestimonials(TESTIMONIALS);
              }} testimonials={testimonials} submit={(index: number,e:Types.Testimonial) => {
                const TESTIMONIALS = [...testimonials];
                TESTIMONIALS[index] = e;
                setTestimonials(TESTIMONIALS)
         }}  />
           </Card> */}
        </Col>

    </Row>
    </Card>
    </Header>
  )
}

export default CreatePackage
