import { Button, Result } from 'antd'

import { useNavigate, useParams } from 'react-router'
import ReviewTest from '../TestReview/ReviewTest'

export default function TestCompleted () {
  const { testId } = useParams()
  const navigate = useNavigate()
  return (
    <Result
      status="success"
      title="Thank you for completing the test"
      //   subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button
          onClick={() => {
            navigate('../')
          }}
          type="primary"
          key="console"
        >
          Go Home {`:-)`}
        </Button>
      ]}
    >
      <ReviewTest onSubmit={() => {
        navigate('../')
      }} testId={testId + ''} />
    </Result>
  )
}
