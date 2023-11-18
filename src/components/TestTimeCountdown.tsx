import { Learner, Types } from '@adewaskar/lms-common'

import Countdown from './Countdown'
import dayjs from 'dayjs'
import { useMemo } from 'react'

interface TestTimeCountdownPropsI {
  testId: string;
}

export default function TestTimeCountdown(props: TestTimeCountdownPropsI) {
  const { data: test } = Learner.Queries.useGetTestDetails(props.testId)
  const testWillEndAt = useMemo(
    () =>
      dayjs(test.live.scheduledAt)
        .add(test.duration.value, 'minute')
        .toISOString(),
    [test]
  )
  return <Countdown targetDate={testWillEndAt} />
}
