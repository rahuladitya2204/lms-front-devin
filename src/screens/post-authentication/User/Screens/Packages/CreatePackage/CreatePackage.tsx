import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
} from 'antd'
import { Enum, Types } from '@adewaskar/lms-common'
import React, { Fragment, ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '@Components/Header'
import Image from '@Components/Image'
import MediaUpload from '@Components/MediaUpload'
import ProductRow from './Products/ProductRow'
import TextArea from '@Components/Textarea'
import { User } from '@adewaskar/lms-common'
import useMessage from '@Hooks/useMessage'

const PRODUCT_TYPES=[{title:'Test',value:'tests'},{title:'Events',value:'events'},{title:'Courses',value:'courses'}]

interface CreatePackageComponentPropsI {
  // data: Types.Package;
  children?: ReactNode;
  closeModal?: Function;
  onSuccess?: () => void;
  onFinish?: (data: Types.Package) => void;
}

const CreatePackage: React.FC<CreatePackageComponentPropsI> = props => {
  const { packageId } = useParams();
  const isEdit = !!packageId;
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
  const message = useMessage();

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
    if (isEdit) {
      updatePackage(
        { id: packageId, data:data },
        {
          onSuccess: () => {
            message.open({
              type: 'success',
              content: 'Package updated'
            })
          }
        }
      )
    } else {
      // @ts-ignore
      createPackage(
        { data:data },
         {
        onSuccess: () => {
             navigate('../');
             message.open({
              type: 'success',
              content: 'Package Created'
            })
          props.onSuccess && props.onSuccess();
             props.closeModal && props.closeModal();
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
     {isEdit?'Update Package':'Create Package'}
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

                    {PRODUCT_TYPES.map(product => {
                      return <Row gutter={[20,20]}>
                        <Col span={24}>
                          <Card title={product.title} >
                        <Form.List name={product.value}>
                     {(fields, { add, remove }) => (
                       <>
                       {fields.map(field => (
                   <ProductRow type={product.value} form={form} key={field.key} name={field.name} remove={remove} />
                 ))}
                         <Row>
                           <Col span={24}>
                               <Button type="dashed" onClick={() => add()} block>Add {product.title }</Button>
                           </Col>
                         </Row>
                       </>
                     )}
                   </Form.List>
                       
                          </Card>
                        </Col>
                     </Row>
                   })}

                    
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
