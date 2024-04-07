import Hydrator from '@ServerComponents/Hydrator'
import { Learner } from '@adewaskar/lms-common'
import LearnerFullPageHolder from '@Screens/LearnerFullPageHolder'
import LearnerRootScreen from '@Learner/Screens/LearnerRoot/LearnerRootScreen'
import dynamic from 'next/dynamic'
import { getToken } from '@Network/index'

const TestPlayerReviewItem = dynamic(
  () =>
    import('@Learner/Screens/Products/Test/TestReview/TestPlayerReviewItemReview'),
  { ssr: false }
)

export default function Page({
  params
}: {
  params: { testId: string, questionId: string }
}) {
  console.log(params,'questionIdquestionId')
  return <TestPlayerReviewItem />
}
