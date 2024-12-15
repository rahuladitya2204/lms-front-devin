import { Types, User } from "@adewaskar/lms-common";
import { useCallback, useEffect } from "react";

import { Form } from "antd";
import { FormInstance } from "antd/lib/form/Form";
import useMessage from "@Hooks/useMessage";
import { useParams } from "@Router/index";
import { useTestStore } from "./useTestStore";

function useUpdateTestForm(itemId: string) {
  const updateItem = useTestStore((s) => s.updateItem); // Using updateItem from useTestStore
  const test = useTestStore((s) => s.test); // Using updateItem from useTestStore
  const setCurrentQuestion = useTestStore((s) => s.setCurrentQuestion); // Using updateItem from useTestStore
  const currentQuestion = useTestStore((s) => s.currentQuestion);
  const { data: topics } = User.Queries.useGetTopics();

  useEffect(() => {
    const currentItem = test.sections
      .flatMap((section) => section.items)
      .find((item) => item._id === itemId);

    if (
      currentItem &&
      (!currentQuestion || currentItem._id !== currentQuestion._id)
    ) {
      setCurrentQuestion(currentItem);
    }
  }, [itemId, test, setCurrentQuestion]);

  const onFormChange = useCallback(
    (data: Partial<Types.TestQuestion>) => {
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
    handleTopicsChange: () => { },
  };
}

export default useUpdateTestForm;
