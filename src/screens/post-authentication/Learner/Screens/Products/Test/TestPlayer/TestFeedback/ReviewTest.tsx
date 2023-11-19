import { Button, Form, Input, Rate, Space, Typography } from 'antd'
import { Learner, Types } from '@adewaskar/lms-common'

const { Title } = Typography

interface ReviewTestPropsI {
  testId: string;
  closeModal?: Function;
  onSubmit: () => void;
}
const { TextArea } = Input;

const ReviewTest: React.FC<ReviewTestPropsI> = ({ testId,closeModal ,onSubmit}) => {
  const { mutate:reviewTest,isLoading: submittingReview} = Learner.Queries.useAddReviewForProduct();
  const [form] = Form.useForm();
  const submitReview=(e:Partial<Types.ProductReview>)=>{
    reviewTest({
      product: {
        type: 'test',
        id:testId
      },
      data:e
    }, {
      onSuccess: () => {
        onSubmit();
        closeModal && closeModal();
      },
      onError: () => {
        onSubmit();
        closeModal && closeModal();
       }
    })
  }
  return  <>
   <Space style={{width:'100%'}} align='center' direction='vertical'>
   <Title level={3}>How would you rate your experience with the test</Title>
<Form onFinish={submitReview} style={{textAlign:'center'}} layout='vertical' form={form}>
<Form.Item rules={[{required:true,message:'Please give us a rating, it helps us improve'}]} name="rating">
          <Rate style={{ marginBottom: 30 }}  />
          </Form.Item>
<Form.Item name="comment">
          <TextArea style={{width: 300}} rows={4} />
        </Form.Item>
        <Button loading={submittingReview} onClick={form.submit}>Submit</Button>
</Form>

    </Space>
    </>
  
}

export default ReviewTest
