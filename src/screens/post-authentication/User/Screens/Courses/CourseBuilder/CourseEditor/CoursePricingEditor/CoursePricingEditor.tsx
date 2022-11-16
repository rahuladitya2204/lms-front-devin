import {
  Button,
  Card,
    Col,
    Form,
    Row,
    Space,
    Table,
    } from 'antd'
    import { Fragment } from 'react'

    import { Course, Plan } from '@Types/Courses.types';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateCoursePlan from './CreateCoursePlan';
import { useGetCoursePlans } from '@User/Api/Course/queries';
    
    
    interface CoursePricingEditorPropsI {
      formData: Partial<Course>;
      course: Course;
      onFormUpdate: (d:Partial<Course>)=>void;
    }
    
    function CoursePricingEditor(props:CoursePricingEditorPropsI) {
      const [form] = Form.useForm<Course>();    
      // const 
      const { data,isLoading:loading } = useGetCoursePlans(props.course._id);
      return (
        <Fragment>
           <Form onValuesChange={props.onFormUpdate} form={form} layout="vertical" autoComplete="off">

            <Card bodyStyle={{padding: 0}} title={'Pricing Plan'} extra={<CreateCoursePlan courseId={props.course._id}>
              <Button>Add Plan</Button>
            </CreateCoursePlan>}>
            <Row>
        <Col span={24}>
          <Table pagination={false} dataSource={data} loading={loading}>
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Plan Type" dataIndex="type" key="type" />
                    <Table.Column title="Listing Price" render={(text, record: Plan) => {
                      return `₹${record.displayPrice.value}`
            }} dataIndex="displayPrice.value" key="displayPrice.value" />
            <Table.Column title="Final Price" render={(text, record: Plan) => {
                      return `₹${record.finalPrice.value}`
            }} dataIndex="finalPrice.value" key="finalPrice.value" />
            <Table.Column
              title="Action"
              key="action"
              render={(_: any, record: Plan) => (
                <Space size="middle">
                  <CreateCoursePlan courseId={props.course._id} plan={record}><EditOutlined
                  /></CreateCoursePlan>
                  <DeleteOutlined />
                </Space>
              )}
            />
          </Table>
        </Col>
      </Row>
</Card>    
              </Form>
    
       </Fragment>
      )
    }
    
    export default CoursePricingEditor
    