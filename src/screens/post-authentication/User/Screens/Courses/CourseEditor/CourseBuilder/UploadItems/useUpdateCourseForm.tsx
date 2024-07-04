import { Types, User } from "@adewaskar/lms-common";
import { useCallback, useEffect } from "react";

import { Form } from "@Lib/index";
import { FormInstance } from "antd/lib/form/Form";
import useMessage from "@Hooks/useMessage";
import { useParams } from "@Router/index";
import { useCourseStore } from "../useCourseScore";

function useUpdateCourseForm(itemId: string) {
  const updateItem = useCourseStore((s) => s.updateItem); // Using updateItem from useCourseStore
  const course = useCourseStore((s) => s.course); // Using updateItem from useCourseStore
  const setCurrentItem = useCourseStore((s) => s.setCurrentItem); // Using updateItem from useCourseStore
  const currentItem = useCourseStore((s) => s.currentItem);
  const { data: topics } = User.Queries.useGetTopics();

  useEffect(() => {
    const currentItem = course.sections
      .flatMap((section) => section.items)
      .find((item) => item._id === itemId);

    if (currentItem && (!currentItem || currentItem._id !== currentItem._id)) {
      setCurrentItem(currentItem);
    }
  }, [itemId, course, setCurrentItem]);

  const onFormChange = useCallback(
    (data: Partial<Types.CourseSectionItem>) => {
      if (itemId) {
        updateItem(itemId, data);
      }
    },
    [itemId, updateItem]
  );

  return {
    itemId,
    updateItem,
    onFormChange,
    topics,
    handleTopicsChange: () => {},
  };
}

export default useUpdateCourseForm;
