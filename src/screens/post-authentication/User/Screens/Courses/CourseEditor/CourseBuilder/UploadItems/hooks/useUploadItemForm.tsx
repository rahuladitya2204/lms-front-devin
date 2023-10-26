// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { useOutletContext, useParams } from "react-router";
import { FormInstance } from "antd/lib/form/Form";
import { findSectionItem } from '@User/Screens/Courses/CourseEditor/CourseBuilder/utils';
import useMessage from '@Hooks/useMessage';
import { Types, User } from '@adewaskar/lms-common';

function useUploadItemForm(form?: FormInstance) {
  const { itemId, id: courseId } = useParams();
  const { data: course } = User.Queries.useGetCourseDetails(courseId + '', {
    enabled: !!courseId
  });

  const message = useMessage();
  const { mutate: updateItemApi } = User.Queries.useUpdateCourseItem();
  const [items] = useOutletContext<[Types.CourseSection[], (sectionId: string, data: Types.CourseSectionItem) => void, Function]>();

  const item = findSectionItem(itemId + '', items) || { title: '', description: '' };
  const currentItemIndex = course.sections.map(s => s.items).flat().findIndex(i => i._id === item?._id);
  const section = course.sections.find(section => section.items.find(i => i._id === item._id)) || { _id: '', items: [], title: '' };
  const { data: topics } = User.Queries.useGetTopics();

  const isMounted = useRef(true);
  const isProgrammaticChange = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const updateItem = useCallback(
    debounce((courseId, itemId, data) => {
      if (!isProgrammaticChange.current) {
        updateItemApi(
          {
            courseId: courseId + "",
            itemId: itemId + "",
            data,
          },
          {
            onSuccess: () => {
              if (isMounted.current) {
                message.open({
                  type: "success",
                  content: `Saved`,
                });
              }
            },
          }
        );
      }
    }, 300),
    []
  );

  useEffect(() => {
    const topicStrings = item.topics?.map((topic) => topic.title) || [];
    isProgrammaticChange.current = true;
    form?.setFieldsValue({ ...item, topics: topicStrings });
    isProgrammaticChange.current = false;

    return () => {
      updateItem.cancel(); // Cancel debounced function on unmount
    };
  }, [item, form, updateItem]);

  const handleTopicsChange = (topicStrings) => {
    const existingTopicTitles = topics.map(t => t.title);
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

  const onFormChange = (data) => {
    const newItem = {
      ...item,
      ...data
    };
    updateItem(courseId + '', itemId + '', newItem);
  };

  return {
    onFormChange,
    handleTopicsChange,
    form,
    topics,
    item,
    sectionId: section._id,
    courseId,
    itemId,
    section,
    currentItemIndex
  };
}

export default useUploadItemForm;
