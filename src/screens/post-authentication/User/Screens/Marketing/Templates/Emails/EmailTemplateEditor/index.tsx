import { Button, Card, Form, message } from "@Lib/index";
import { Fragment, useEffect } from "react";

import EmailTemplateDetailsEditor from "./EmailTemplateDetailsEditor";
import Header from "@Components/Header";
import { Types } from "@adewaskar/lms-common";
import { User } from "@adewaskar/lms-common";
import useMessage from "@Hooks/useMessage";
import { useParams } from "@Router/index";

function EmailTemplateEditor() {
  const { id: emailTemplateId } = useParams();
  const { mutate: updateEmailTemplate, isLoading: loading } =
    User.Queries.useUpdateEmailTemplate();

  const { data: template, isFetching: loadingTemplate } =
    User.Queries.useGetEmailTemplateDetails(emailTemplateId + "", {
      enabled: !!emailTemplateId,
    });

  const saveEmailTemplate = (data: Types.EmailTemplate) => {
    updateEmailTemplate(
      {
        id: emailTemplateId + "",
        data: data,
      },
      {
        onSuccess: () => {
          message.open({
            type: "success",
            content: "Saved",
          });
          // navigate('../')
        },
      }
    );
  };
  const [form] = Form.useForm<Types.EmailTemplate>();

  useEffect(() => {
    form.setFieldsValue(template);
  }, [template]);

  return (
    <Header
      showBack
      title="Email Template Editor"
      extra={[
        <Fragment>
          <Button loading={loading} onClick={form.submit}>
            Save as Draft
          </Button>
          <Button loading={loading} type="primary">
            Publish Template
          </Button>
        </Fragment>,
      ]}
    >
      <Form
        initialValues={template}
        form={form}
        onFinish={saveEmailTemplate}
        layout="vertical"
        autoComplete="off"
      >
        <Card
          loading={loadingTemplate}
          extra={<Button danger>Send test Mail</Button>}
        >
          <EmailTemplateDetailsEditor id={template._id} />
        </Card>
      </Form>
    </Header>
  );
}

export default EmailTemplateEditor;
