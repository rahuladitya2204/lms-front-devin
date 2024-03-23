import { Button, Form, Select } from 'antd'
import { Types, User } from '@invinciblezealorg/lms-common'
import { useEffect, useMemo } from 'react';

import ProductRow from './ProductRow';

const PRODUCT_TYPES = [{ label: 'Course', value: 'course' }, { label: 'Test', value: 'test' }, { label: 'Event', value: 'event' }];

interface AddProductPropsI {
    data?: Types.Product
    closeModal?: () => void;
    submit:(e:{type:string,data:any})=>void
}

export default function AddProduct (props: AddProductPropsI) {
  const [form] = Form.useForm()

  useEffect(
    () => {
      form.setFieldsValue({
        product:props.data
      })
    },
    [props.data]
  )
  const product = Form.useWatch(['product'], form);
  const { data: courses} = User.Queries.useGetCourses();
  const { data: tests} = User.Queries.useGetTests();
  const { data: events } = User.Queries.useGetEvents();

  const data = useMemo(() => {
    let result: any[] = [];
    switch (product?.type) {
      case 'course':
        result = courses;
        break;
      case 'test':
        result = tests;
        break;
      case 'event':
        result = events;
        break;
      default:
        result = []; // or any default value you prefer
    }
    return result;
  }, [product]);

  const onSubmit = ({product}: {product:Types.Product}) => {
    const item={
      type: product.type,
      id: product.id,
  data: data?.find((e:any) => e._id === product.id)
    }
    console.log(product.id, data,item ,'1233');
    props.submit(item);
    form.resetFields();
    props.closeModal&&props.closeModal()
}


  // console.log(product,data,'123123')
  return (
    <Form initialValues={{
      product: {
        type: 'course',
        id:''
        }
      }} layout='vertical' onFinish={onSubmit} form={form}>
      <Form.Item label="Product Type" name={['product','type']}>
      <Select options={PRODUCT_TYPES} />
      </Form.Item>
      {/* <Form.Item label="Select Product"  name={['product','id']}>
        <Select mode="multiple"  options={data?.map(i => {
          return {
            label: <ProductRow product={{id: i._id,type: product.type}} />,
            value: i._id
          }
      })} />
      </Form.Item> */}

      <Button type='primary' onClick={form.submit}>Add</Button>
    </Form>
  )
}
