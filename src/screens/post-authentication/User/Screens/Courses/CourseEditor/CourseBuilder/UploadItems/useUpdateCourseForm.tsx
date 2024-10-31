import { Constants, Types, User } from "@adewaskar/lms-common";
import { useCallback, useEffect } from "react";
import { useCourseStore } from "../useCourseStore";
import { FormInstance } from "antd/lib";
import { useParams } from "@Router/index";


function useUpdateCourseForm(form: FormInstance) {
  const { itemId } = useParams();
  const updateItem = useCourseStore((s) => s.updateItem);
  const course = useCourseStore((s) => s.course);
  const { setCurrentItem, currentItem } = useCourseStore((s) => s);
  const { data: topics } = User.Queries.useGetTopics();
  useEffect(() => {
    const item = course.sections
      .map((section) => section.items).flat()
      .find((item) => item._id === itemId);
    if (
      item?._id
    ) {
      setCurrentItem(item);
      form.setFieldsValue(item);
    }
  }, [itemId, course, setCurrentItem]);

  // useEffect(() => {
  //   if (currentItem._id) {
  //     form.setFieldsValue(currentItem);
  //   }
  // }, [currentItem])

  return {
    itemId,
    updateItem,
    topics,
  };
}

export default useUpdateCourseForm;
