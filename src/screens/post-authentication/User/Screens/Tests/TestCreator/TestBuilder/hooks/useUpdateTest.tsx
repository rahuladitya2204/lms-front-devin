import { useEffect, useState, useRef, useCallback } from 'react';
import { FormInstance } from 'antd/lib/form/Form';
import { debounce, isEqual } from 'lodash';
import { useParams } from 'react-router';
import useMessage from '@Hooks/useMessage';
import { Types, User } from '@adewaskar/lms-common';

function useUpdateTestForm(form: FormInstance) {
  const message = useMessage();
  const [correctOptions, setCorrectOptions] = useState<number[]>([]);
  const { data: topics } = User.Queries.useGetTopics();
  let { itemId, id: testId } = useParams();
  const { data: item } = User.Queries.useGetTestItemDetails(testId + '',itemId+'', {
    enabled: !!testId
  });

  const { mutate: updateItemApi, isLoading } = User.Queries.useUpdateTestItem();

  const isMounted = useRef(true);
  const isProgrammaticChange = useRef(false);
  const initialItemRef = useRef<Types.TestQuestion | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      form.resetFields();
    };
  }, []);

  const updateItem = useCallback(
    debounce((testId, itemId, data) => {
      if (!isProgrammaticChange.current) {
        updateItemApi(
          {
            testId: testId + '',
            itemId: itemId + '',
            data
          },
          {
            onSuccess: () => {
              if (isMounted.current) {
                message.open({
                  type: 'success',
                  content: `Saved`
                });
              }
            }
          }
        );
      }
    }, 300),
    []
  );

  useEffect(() => {
    const topicStrings = item.topics?.map(topic => topic.title) || [];
    isProgrammaticChange.current = true;
    form.setFieldsValue({ ...item, topics: topicStrings });
    setCorrectOptions(item.correctOptions);
    isProgrammaticChange.current = false;

    initialItemRef.current = item;

    return () => {
      updateItem.cancel(); // Cancel debounced function on unmount
    };
  }, [item, form, updateItem]);

  useEffect(() => {
    console.log(correctOptions,'correctOptionscorrectOptions')
    if(correctOptions?.length)
    onFormChange({ correctOptions });
  }, [correctOptions]);

  const handleTopicsChange = (topicStrings: string[]) => {
    const existingTopicTitles = topics ? topics.map(t => t.title) : [];
    const newTopics = topicStrings.map(title => {
      if (existingTopicTitles.includes(title)) {
        return {
          title,
          topicId: topics.find(t => t.title === title)?._id || ''
        };
      } else {
        return { title, topicId: '' };
      }
    });
    onFormChange({ topics: newTopics });
  };
// @ts-ignore
  const onFormChange = (data) => {
    if (!isEqual(initialItemRef.current, { ...item, ...data })) {
      const newItem = {
        ...item,
        ...data
      };
      updateItem(testId + '', itemId + '', newItem);
    }
  };

  return {
    form,
    item,
    testId: testId,
    itemId,
    updateItem: (data: Types.TestQuestion) => {
      initialItemRef.current = data;
      onFormChange(data)
    },
    onFormChange,
    topics,
    handleTopicsChange,
    correctOptions,
    setCorrectOptions,
    isLoading
  };
}

export default useUpdateTestForm;
