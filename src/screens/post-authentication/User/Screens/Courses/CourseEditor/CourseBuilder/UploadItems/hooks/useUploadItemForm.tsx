// @ts-nocheck
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "@Router/index";

import { FormInstance } from "antd/lib/form/Form";
import { User } from "@adewaskar/lms-common";
import { debounce } from "lodash";
import useMessage from "@Hooks/useMessage";
import { message } from "@Lib/index";

function useUploadItemForm(form?: FormInstance) {
  const { itemId, id: courseId } = useParams();
  const { data: course, isLoading } = User.Queries.useGetCourseDetails(
    courseId + "",
    {
      enabled: !!courseId,
    }
  );
  const { data: item } = User.Queries.useGetCourseItemDetails(courseId, itemId);
  const { mutate: updateItemApi } = User.Queries.useUpdateCourseItem();
  const currentItemIndex = course.sections
    .map((s) => s.items)
    .flat()
    .findIndex((i) => i._id === item?._id);
  const section = course.sections.find((section) =>
    section.items.find((i) => i._id === item._id)
  ) || { _id: "", items: [], title: "" };
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
    const existingTopicTitles = topics.map((t) => t.title);
    const newTopics = topicStrings.map((title) => {
      if (existingTopicTitles.includes(title)) {
        return {
          title,
          topicId: topics.find((t) => t.title === title)?._id || "",
        };
      } else {
        return { title, topicId: "" };
      }
    });
    onFormChange({ topics: newTopics });
  };

  const onFormChange = (data) => {
    const newItem = {
      ...item,
      ...data,
    };
    console.log(data, "updated");
    updateItem(courseId + "", itemId + "", newItem);
  };

  return {
    onFormChange,
    handleTopicsChange,
    form,
    topics,
    item,
    sectionId: section._id,
    courseId,
    isLoading,
    itemId,
    section,
    currentItemIndex,
  };
}

export default useUploadItemForm;
