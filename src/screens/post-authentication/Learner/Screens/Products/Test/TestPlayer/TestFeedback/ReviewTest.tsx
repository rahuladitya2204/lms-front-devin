import { Button, Form, Input, Rate, Space } from 'antd'
import { Enum, Learner, Types } from '@adewaskar/lms-common'

import TextArea from '@Components/Textarea';
import { Typography } from '@Components/Typography';
import { useText } from '@Components/Editor/SunEditor/utils';

const { Title } = Typography

interface ReviewTestPropsI {
  testId: string;
  closeModal?: Function;
  onSubmit: () => void;
}

const ReviewTest: React.FC<ReviewTestPropsI> = ({ testId, closeModal, onSubmit }) => {
  const { mutate: reviewTest, isLoading: submittingReview } = Learner.Queries.useAddReviewForProduct();
  const {
    data: {
      metadata: {
        test: { language },
      },
    },
    isLoading: loadingEp,
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: testId + "",
  });
  const [form] = Form.useForm();
  const submitReview = (e: Partial<Types.ProductReview>) => {
    reviewTest({
      product: {
        type: 'test',
        id: testId
      },
      data: e
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
  const { FormatLangText } = useText(language);
  return <>
    <Space style={{ width: '100%' }} align='center' direction='vertical'>
      <Title style={{ textAlign: 'center' }} level={3}>
        {FormatLangText('PLEASE_RATE_US')}
      </Title>
      <Form onFinish={submitReview} style={{ textAlign: 'center' }} layout='vertical' form={form}>
        <Form.Item rules={[{ required: true, message: FormatLangText('PLEASE_GIVE_US_RATING') }]} name="rating">
          <Rate style={{ marginBottom: 30 }} />
        </Form.Item>
        <Form.Item rules={[{ required: true, message: FormatLangText('PLEASE_GIVE_US_FEEDBACK') }]} name="comment">
          <TextArea id='submit-review-text-input' style={{ width: 300 }} rows={4} />
        </Form.Item>
        <Button id='submit-review-button' loading={submittingReview} onClick={form.submit}>
          {FormatLangText('SUBMIT')}
        </Button>
      </Form>

    </Space>
  </>

}

export default ReviewTest
