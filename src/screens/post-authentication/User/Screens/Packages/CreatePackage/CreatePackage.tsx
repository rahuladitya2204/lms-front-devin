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

interface CreatePackageComponentPropsI {
  // data: Types.Package;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Package) => void;
}

const CreatePackage: React.FC<CreatePackageComponentPropsI> = props => {
  const { packageId } = useParams();
  const [products, setProducts] = useState<{id:string,data:any}[]>([]);
  const navigate = useNavigate();
  const {
    mutate: createPackage,
    isLoading: createPackageLoading
  } = User.Queries.useCreatePackage()
  const {
    mutate: updatePackage,
    isLoading: updatePackageLoading
  } = User.Queries.useUpdatePackage()

  const {data: eventDetails,isLoading: loadingPackage}=User.Queries.useGetPackageDetails(packageId+'',{
    enabled:!!packageId
  })

  const [form] = Form.useForm<Types.Package>()

  const onSubmit = (e: Types.Package) => {
    const data= {
      ...e,
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
      createPackage(data, {
        onSuccess: () => {
          navigate('../')
          props.onSuccess && props.onSuccess();
          props.closeModal && props.closeModal()
        }
      })
    }
    // onFinish && onFinish(e)
  }

  const image = Form.useWatch('image', form);

  const date = dayjs(Form.useWatch('scheduledAt', form))


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
          { required: true, message: 'Please enter a title of the events' }
        ]}
        name="title"
        label="Package Title"
        required
      >
        <Input placeholder="Enter a title for the live session" />
      </Form.Item>
                    <Row gutter={[10, 10]}>
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
      </Row>
                  </Col>
                  <Col span={8}>
        <MediaUpload
                  source={{
                    type: 'event.thumbnail',
                    value: packageId + ''
                  }}
                  uploadType="image"
                  // prefixKey={`events/${packageId}/image`}
                  cropper
                  width="100%"
                  // height="200px"
                  aspect={16 / 9}
                  renderItem={() => (
                    <Image preview={false} src={image} />
                  )}
                      onUpload={file => {
                    console.log(file,'uploaded image!')
                    form.setFieldValue('image', file.url)
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
            message: 'Please enter a description of the events'
          }
        ]}
        name={["description"]}
        required
      >
                      <TextArea height={250} html label="Description" name={["description"]} />
                      
                    </Form.Item>
                  </Col>
      {/* <Col span={12}>
      <Form.Item name='type' label='Package Type'>
<Select
          options={[
            { label: 'Webinar', value: Enum.PackageType.WEBINAR },
                          { label: 'Conversational', value: Enum.PackageType.CONVERSATIONAL },
                          { label: 'Offline', value: Enum.PackageType.OFFLINE }

          ]}
        />
        </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label='Record Session' name={['recording', 'enabled']}>
        <Checkbox name="recording.enabled">
          <VideoCameraOutlined /> 
        </Checkbox>
      </Form.Item>
                  </Col>
                  <Col span={12}>
                  <Form.Item label='Package Location'>
    <LocationAutocomplete onLocationChange={console.log} />
  </Form.Item>

  </Col>
      </Row>

        <Row gutter={[20,20]}>
                  <Col span={12}>
                    <Form.Item label="Access Type" name="accessType">
        <Select
          options={[
            { label: 'Learners', value: 'learner' },
            { label: 'Open for all', value: 'open' }
          ]}
        />
      </Form.Item>
          </Col>
          <Col span={12}>  <PriceFormItem name="price" label="Price" /></Col>
      </Row>
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
