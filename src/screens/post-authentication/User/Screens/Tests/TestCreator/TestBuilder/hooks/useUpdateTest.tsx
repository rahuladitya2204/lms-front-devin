import { Types, User } from '@adewaskar/lms-common'
import { useEffect, useState } from 'react'

import { FormInstance } from 'antd/lib/form/Form'
import { debounce } from 'lodash'
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils'
import useMessage from '@Hooks/useMessage'
import { useParams } from 'react-router'

function useUpdateTestForm(form: FormInstance) {
  const message = useMessage()
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  const { data: topics } = User.Queries.useGetTopics()
  let { itemId, id: testId } = useParams()
  const { data: test } = User.Queries.useGetTestDetails(testId + '', {
    enabled: !!testId
  })
  const items = test.sections.map(s => s.items).flat()

  const { mutate: updateItemApi,isLoading } = User.Queries.useUpdateTestItem()
  const updateItem = debounce(updateItemApi, 300)
  const item =
    findSectionItem(itemId + '', items) || {};
  const currentItemIndex = item ? items.findIndex(i => i._id === item._id) : -1


  useEffect(() => {
    // Convert topics from array of objects to array of strings
    const topicStrings = item.topics?.map((topic:Types.ProductTopic) => topic.title) || []; // ADDED
    form?.setFieldsValue({ ...item, topics: topicStrings }); // MODIFIED
    setCorrectOptions(item.correctOptions)
  }, [item]);

  useEffect(() => { 
    onFormChange({correctOptions})
  },[correctOptions])

  const handleTopicsChange = (topicStrings: string[]) => {
    console.log(topicStrings,'topicStrings')
    // ADDED
    // Convert array of strings back to array of objects
    const existingTopicTitles = topics.map(t => t.title)
    const newTopics = topicStrings.map(title => {
      if (existingTopicTitles.includes(title)) {
        // Existing topic, return with its ID
        return {
          title,
          topicId: topics.find(t => t.title === title)?._id || ''
        }
      } else {
        // New topic, return without ID
        return { title, topicId: '' }
      }
    })
    onFormChange({ topics: newTopics })
  }

  const onFormChange = (data: Partial<Types.TestQuestion>) => {
    console.log(data,'loioikl')
    // delete data.correctOptions;
    const newItem = {
      ...item,
      ...data,
    }

    updateItem(
      {
        testId: testId + '',
        itemId: itemId + '',
        data: newItem
      },
      {
        onSuccess: () => {
          // message.open({
          //   type: 'success',
          //   content: `Saved`
          // })
        }
      }
    )
    // saveCourse();
  }

  return {
    form,
    item,
    testId: testId,
    itemId,
    currentItemIndex,
    onFormChange:onFormChange,
    topics,
    handleTopicsChange,
    correctOptions, setCorrectOptions,
    isLoading
  }
}

export default useUpdateTestForm
