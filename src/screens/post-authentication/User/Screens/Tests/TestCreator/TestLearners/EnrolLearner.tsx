import { Button, Col, Form, Row, Select, Spin, message } from "antd";
import { Types, User } from "@adewaskar/lms-common";

import { ActionModalI } from "@Components/ActionModal/ActionModal";
import useMessage from "@Hooks/useMessage";

interface EnrollLearnerPropsI extends ActionModalI {
  product: Types.Product;
}

export default function EnrollLearner(props: EnrollLearnerPropsI) {
  const { data: learners, isLoading: loadingLearners } =
    User.Queries.useGetLearners();
  const { data: enrolledLearners } = User.Queries.useGetEnrolledProductLearners(
    props.product.id
  );
  const { mutate: createLearnerEnrollment, isLoading: enrollingLearner } =
    User.Queries.useCreateEnrollmentOfLearner(props.product);
  const [form] = Form.useForm();
  const createEnrollment = (d: { learner: string }) => {
    // console.log(d, "ddd");
    createLearnerEnrollment(
      {
        learnerId: d.learner,
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: `Enrollment created successfully for learner`,
          });
          props.closeModal && props.closeModal();
        },
        onError: (er: any) => {
          message.open({
            type: "error",
            content: er.response.data.message,
          });
        },
      }
    );
  };
  return (
    <Form layout="vertical" form={form} onFinish={createEnrollment}>
      <Spin spinning={loadingLearners}>
        <Form.Item label="Select Learner" name="learner">
          <Select
            showSearch
            loading={loadingLearners}
            style={{ width: 250 }}
            options={learners
              .filter((l) => {
                // enrolledLearners[0].
                const isEnrolled = enrolledLearners.find(
                  // @ts-ignore
                  (le) => le.learner._id === l._id
                );
                console.log(isEnrolled);
                return l.name && !isEnrolled;
              })
              .map((l) => {
                return {
                  label: l.name,
                  value: l._id,
                };
              })}
          />
        </Form.Item>
      </Spin>
      <Button loading={enrollingLearner} onClick={form.submit} type="primary">
        Create Enrollment
      </Button>
    </Form>
  );
}
