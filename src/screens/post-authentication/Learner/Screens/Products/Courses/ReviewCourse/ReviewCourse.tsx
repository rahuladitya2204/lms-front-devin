import { Button, Form, Input, Rate, Space } from 'antd'
import { Learner, Types } from '@invinciblezealorg/lms-common'

import { Typography } from '@Components/Typography';

const { Title } = Typography

interface ReviewCoursePropsI {
  course: Types.Course;
  closeModal?: Function;
}
const { TextArea } = Input;

const ReviewCourse: React.FC<ReviewCoursePropsI> = ({ course,closeModal }) => {
  const { mutate:reviewCourse} = Learner.Queries.useAddReviewForProduct();
  const [form] = Form.useForm();
  const submitReview=(e:Partial<Types.ProductReview>)=>{
    console.log(e, 'reciew');
    reviewCourse({
      product: {
        id: course._id,
        type:'course'
      },
      data:e
    }, {
      onSuccess: () => {
        closeModal && closeModal();
       }
    })
  }
  return  <>
   <Space style={{width:'100%'}} align='center' direction='vertical'>
   <Title level={3}>How would you rate your experience with the course</Title>
<Form onFinish={submitReview} style={{textAlign:'center'}} layout='vertical' form={form}>
<Form.Item name="rating">
          <Rate style={{ marginBottom: 30 }}  />
          </Form.Item>
<Form.Item name="comment">
          <TextArea style={{width: 300}} rows={4} />
        </Form.Item>
        <Button onClick={form.submit}>Submit</Button>
</Form>

    </Space>
    </>
  
}

export default ReviewCourse
