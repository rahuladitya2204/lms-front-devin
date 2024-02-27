import AppProvider from 'screens/AppProvider'
import Header from '@Components/Header'
import { User } from '@adewaskar/lms-common'
import { useParams } from 'react-router'

const TestEvaluator = () => {
  const { id: testID } = useParams()
  const { data: test } = User.Queries.useGetTestDetails(testID + '')
  return (
    <AppProvider>
      <Header title={`Test Evaluator: ${test.title}`}>Oh YEah</Header>
    </AppProvider>
  )
}

export default TestEvaluator
