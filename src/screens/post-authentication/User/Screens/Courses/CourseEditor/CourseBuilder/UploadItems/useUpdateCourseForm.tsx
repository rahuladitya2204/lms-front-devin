import { Types, User } from "@adewaskar/lms-common";
import { useCallback, useEffect } from "react";

import { useCourseStore } from "../useCourseStore";

function useUpdateCourseForm(itemId: string) {
  const updateItem = useCourseStore((s) => s.updateItem); // Using updateItem from useCourseStore
  const course = useCourseStore((s) => s.course); // Using updateItem from useCourseStore
  const setCurrentQuestion = useCourseStore((s) => s.setCurrentItem); // Using updateItem from useCourseStore
  const currentQuestion = useCourseStore((s) => s.currentItem);
  const { data: topics } = User.Queries.useGetTopics();

  useEffect(() => {
    const currentItem = course.sections
      .flatMap((section) => section.items)
      .find((item) => item._id === itemId);

    if (
      currentItem &&
      (!currentQuestion || currentItem._id !== currentQuestion._id)
    ) {
      setCurrentQuestion(currentItem);
    }
  }, [itemId, course, setCurrentQuestion]);

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
  };
}

export default useUpdateCourseForm;
