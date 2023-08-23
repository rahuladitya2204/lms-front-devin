import { Button } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import { useEffect } from 'react'

interface GenerateWithAIPropsI {
  testId: string;
  extra?: any;
  onValuesChange: Function;
  fields: string[];
}

function GenerateWithAI(props: GenerateWithAIPropsI) {
  const { data: Test } = User.Queries.useGetTestDetails(props.testId, {
    enabled: !!props.testId
  })
  const {
    mutate: generateTestInfo,
    isLoading: generatingInfo,
    data: generatedData
  } = User.Queries.useGetGenerativeTestInfo();

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
      disabled={!Test.title}
      loading={generatingInfo}
      onClick={() =>
        generateTestInfo({
          data: {
            title: Test.title
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
