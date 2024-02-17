import { Enum, Types } from '@adewaskar/lms-common'

import { CloseOutlined } from '@ant-design/icons'
import { Tag } from 'antd'

interface TestAnswerSheetProcessStatusTagPropsI {
  answerSheet: Types.TestAnswerSheet;
}
export default function TestAnswerSheetProcessStatusTag({
  answerSheet
}: TestAnswerSheetProcessStatusTagPropsI) {
  if (answerSheet.status === Enum.TestAnswerSheetProcessStatus.SUCCESS) {
    return (
      <Tag
        style={{ width: 100, textAlign: 'center', marginBottom: 5 }}
        color="green-inverse"
      >
        Success
      </Tag>
    )
  }

  if (
    answerSheet.status === Enum.TestAnswerSheetProcessStatus.LEARNER_NOT_FOUND
  ) {
    return (
      <Tag
        style={{ width: 100, textAlign: 'center', marginBottom: 5 }}
        color="blue-inverse"
      >
        Learner Not Found
      </Tag>
    )
  }

  if (
    answerSheet.status ===
    Enum.TestAnswerSheetProcessStatus.ENROLLMENT_NOT_FOUND
  ) {
    return (
      <Tag icon={<CloseOutlined />}
        style={{ width: 100, textAlign: 'center', marginBottom: 5 }}
        color="red-inverse"
      >
         Enrollment
      </Tag>
    )
  }

  return <span>-</span>
}
