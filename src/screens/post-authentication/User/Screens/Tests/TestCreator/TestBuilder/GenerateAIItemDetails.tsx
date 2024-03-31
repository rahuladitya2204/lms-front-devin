import { Button, Form } from 'antd'

import { User } from '@adewaskar/lms-common'
import { useParams } from '@Router/index'

interface GenerateAIITemDetailsPropsI {
  field: string;
  label: string;
  onFinish?: (data: any) => void;
  // testId: string;
  // itemId: string;
}

export default function GenerateAIItemDetails(
  props: GenerateAIITemDetailsPropsI
) {
  const { field, label, onFinish } = props
  const { itemId, id: testId } = useParams()
  const form = Form.useFormInstance()
  const {
    mutate: generateItemInfoApi,
    isLoading: generatingSummary,
    data: generatedInfo
  } = User.Queries.useGetGenerativeTestItemInfo()
  const generateItemInfo = (field: string) => {
    generateItemInfoApi(
      { data: { testId: testId + '', itemId: itemId + '', fields: [field] } },
      {
        onSuccess: data => {
          form.setFieldsValue(data)
          onFinish && onFinish(data)
        }
      }
    )
  }

  return (
    <Button
      loading={generatingSummary}
      onClick={() => generateItemInfo(field)}
      type="primary"
      size="small"
    >
      {label}
    </Button>
  )
}
