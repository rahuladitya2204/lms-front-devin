import { Types, User } from '@adewaskar/lms-common'
import { useCallback, useEffect } from 'react'

import { Form } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'
import { useTestStore } from './useTestStore'

function useUpdateTestForm(itemId: string) {
  const message = useMessage()
  const { updateItem, test, setCurrentQuestion } = useTestStore(s => s) // Using updateItem from useTestStore

  const { data: topics } = User.Queries.useGetTopics()

  useEffect(
    () => {
      const currentItem = test.sections
        .flatMap(section => section.items)
        .find(item => item._id === itemId)
      if (currentItem) {
        setCurrentQuestion(currentItem)
      }
    },
    [test, itemId, setCurrentQuestion]
  )

  const handleTopicsChange = useCallback(
    (topicStrings: string[]) => {
      // Logic for updating topics
      // ...
    },
    [topics]
  )

  const onFormChange = useCallback(
    (data: Partial<Types.TestQuestion>) => {
      if (itemId) {
        updateItem(itemId, data)
      }
    },
    [itemId, updateItem, message]
  )

  return {
    itemId,
    updateItem,
    onFormChange,
    topics,
    handleTopicsChange
  }
}

export default useUpdateTestForm
