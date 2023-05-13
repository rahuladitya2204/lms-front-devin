import { Constants, Types } from '@adewaskar/lms-common'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { User, Utils } from '@adewaskar/lms-common'

import { Button } from 'antd'
import { useEffect } from 'react'

interface GenerateWithAIPropsI {
  course: Types.Course;
  onValuesChange: Function;
  fields: string[];
}

function GenerateWithAI(props: GenerateWithAIPropsI) {
  const {
    mutate: generateCourseInfo,
    isLoading: generatingInfo,
    data: generatedData
  } = User.Queries.useGetGenerativeCourseInfo()

  useEffect(
    () => {
      props.onValuesChange(generatedData)
    },
    [generatedData]
  )

  return (
    <Button
      size="small"
      type="primary"
      disabled={!props.course.title}
      loading={generatingInfo}
      onClick={() =>
        generateCourseInfo({
          data: {
            title: props.course.title
          },
          fields: props.fields
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
