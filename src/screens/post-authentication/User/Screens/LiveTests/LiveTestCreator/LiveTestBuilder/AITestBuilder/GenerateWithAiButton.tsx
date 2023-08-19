import { Button } from 'antd'
import { StarOutlined } from '@ant-design/icons'
import { User } from '@adewaskar/lms-common'
import { useEffect } from 'react'

interface GenerateWithAIPropsI {
  liveTestId: string;
  extra?: any;
  onValuesChange: Function;
  fields: string[];
}

function GenerateWithAI(props: GenerateWithAIPropsI) {
  const { data: liveTest } = User.Queries.useGetLiveTestDetails(props.liveTestId, {
    enabled: !!props.liveTestId
  })
  const {
    mutate: generateLiveTestInfo,
    isLoading: generatingInfo,
    data: generatedData
  } = User.Queries.useGetGenerativeLiveTestInfo();

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
      disabled={!liveTest.title}
      loading={generatingInfo}
      onClick={() =>
        generateLiveTestInfo({
          data: {
            title: liveTest.title
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
