import { Constants, Types } from '@adewaskar/lms-common'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { User, Utils } from '@adewaskar/lms-common'

import { Button } from 'antd'
import { useEffect } from 'react'

interface GenerateWithAIPropsI {
  courseId: string;
  extra?: any;
  onValuesChange: Function;
  fields: string[];
}

function GenerateWithAI(props: GenerateWithAIPropsI) {
  const { data: course } = User.Queries.useGetCourseDetails(props.courseId, {
    enabled: !!props.courseId
  })
  const {
    mutate: generateCourseInfo,
    isLoading: generatingInfo,
    data: generatedData
  } = User.Queries.useGetGenerativeCourseInfo()

  useEffect(
    () => {
      if (generatedData) {
        props.onValuesChange(generatedData)
      }
    },
    [generatedData]
  )

  return (
    <Button
      size="small"
      type="dashed"
      danger
      disabled={!course.title}
      loading={generatingInfo}
      onClick={() =>
        generateCourseInfo({
          data: {
            title: course.title
          },
          fields: props.fields,
          extra: props.extra
        })
      }
      style={{ marginTop: 10 }}
      icon={<StarOutlined style={{ fontSize: 12 }} />}
    >
      Generate with AI
    </Button>
  )
}

export default GenerateWithAI
