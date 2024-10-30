import { Types, User } from "@adewaskar/lms-common";
import { useCallback, useEffect } from "react";
import { useCourseStore } from "../useCourseStore";
import { Form } from "antd";
import { FormInstance } from "antd/lib";

function useUpdateCourseForm(itemId: string, form: FormInstance) {
  const updateItem = useCourseStore((s) => s.updateItem);
  const course = useCourseStore((s) => s.course);
  const setCurrentQuestion = useCourseStore((s) => s.setCurrentItem);
  const { data: topics } = User.Queries.useGetTopics();
  useEffect(() => {
    const currentItem = course.sections
      .map((section) => section.items).flat()
      .find((item) => item._id === itemId);
    console.log(currentItem, itemId, 'currentItem')
    if (
      currentItem
    ) {
      setCurrentQuestion(currentItem._id);
      form.setFieldsValue(currentItem)
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
