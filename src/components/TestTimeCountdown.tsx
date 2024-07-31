import { Enum, Learner, Types } from "@adewaskar/lms-common";

import Countdown from "./Countdown";
import dayjs from "dayjs";
import { useMemo } from "react";

interface TestTimeCountdownPropsI {
  testId: string;
}

export default function TestTimeCountdown(props: TestTimeCountdownPropsI) {
  const { data: test } = Learner.Queries.useGetTestDetails(props.testId);
  const {
    data: {
      metadata: {
        test: { startedAt },
      },
    },
  } = Learner.Queries.useGetEnrolledProductDetails({
    type: Enum.ProductType.TEST,
    id: props.testId,
  });
  const testWillEndAt = useMemo(
    () => dayjs(startedAt).add(test.duration.value, "minute").toISOString(),
    [test]
  );
  return <Countdown targetDate={testWillEndAt} />;
}
