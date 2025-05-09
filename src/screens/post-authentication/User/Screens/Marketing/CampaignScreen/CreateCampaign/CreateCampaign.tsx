import { Button, Card, Col, Form, Modal, Row, Tabs, message } from "antd";
import { Constants, Types } from "@adewaskar/lms-common";
import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useParams } from "@Router/index";

import AddRecipients from "./AddRecipients/AddReciepients";
import CampaignForm from "./CampaignForm/CampaignForm";
import CreateEmailTemplate from "./CreateTemplate/Email/CreateEmailTemplate";
import CreateSmsTemplate from "./CreateTemplate/Sms/CreateSmsTemplate";
import CreateWhatsappTemplate from "./CreateTemplate/Whatsapp/CreateWhatsappTemplate";
import Header from "@Components/Header";
import Stepper from "@Components/Stepper";
import { User } from "@adewaskar/lms-common";
import dayjs from "dayjs";
import useMessage from "@Hooks/useMessage";

const { confirm } = Modal;
interface CreateCampaignComponentPropsI {
  children?: ReactNode;
  data?: Partial<Types.Campaign>;
  onFinish?: Function;
}

const CreateCampaign: React.FC<CreateCampaignComponentPropsI> = (props) => {
  const { id } = useParams();
  const params = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<Types.Campaign>();
  const { mutate: createCampaign, isLoading: createCampaignLoading } =
    User.Queries.useCreateCampaign();
  const { mutate: updateCampaignApi, isLoading: updateCampaignLoading } =
    User.Queries.useUpdateCampaign();

  const { mutate: executeCampaign, isLoading: initiatingExecution } =
    User.Queries.useExecuteCampaign();

  const { data: campaignDetails } = User.Queries.useGetCampaignDetails(
    params.id + "",
    {
      enabled: !!params.id,
    }
  );

  const saveCampaign = (d: Types.Campaign) => {
    const data: Types.CreateCampaignPayload = {
      ...d,
      status: "draft",
    };
    if (campaignDetails?._id) {
      updateCampaignApi(
        { id: campaignDetails?._id, data: data },
        {
          onSuccess: (r) => {
            message.open({
              type: "success",
              content: "Campaign Draft Saved",
            });
          },
        }
      );
    } else {
      createCampaign(data, {
        onSuccess: (r) => {
          message.open({
            type: "success",
            content: "Campaign Saved",
          });
          navigate('/admin/marketing/campaign')
        },
      });
    }
    // onFinish && onFinish(e)
  };

  useEffect(() => {
    // console.log(campaignDetails,'campaignDetails')
    form.setFieldsValue(campaignDetails);
    if (campaignDetails.scheduledAt) {
      form.setFieldValue(["scheduledAt"], dayjs(campaignDetails.scheduledAt));
    }
  }, [campaignDetails]);
  const channel = Form.useWatch(["channel"], form);

  const isFormValid = () => {
    const fieldsError = form.getFieldsError();
    return fieldsError.every(({ errors }) => errors.length === 0);
  };

  const GET_TAB_ITEMS = () => {
    const arr = [];
    if (channel?.includes("email")) {
      arr.push({
        key: "email",
        label: `Email`,
        children: <CreateEmailTemplate />,
      });
    }
    if (channel?.includes("whatsapp")) {
      arr.push({
        key: "whatsapp",
        label: `Whatsapp`,
        children: <CreateWhatsappTemplate />,
      });
    }
    if (channel?.includes("sms")) {
      arr.push({
        key: "sms",
        label: `SMS`,
        children: <CreateSmsTemplate />,
      });
    }
    return arr;
  };
  return (
    <Header
      showBack
      title="Create Campaign"
      extra={[
        <Button
          type='dashed'
          style={{ marginRight: 10 }}
          // disabled={!isFormValid}
          loading={createCampaignLoading || updateCampaignLoading}
          onClick={form.submit}
        >
          Save Campaign
        </Button>,
        (!!isFormValid() && campaignDetails._id) ? (
          <Button danger
            type="primary"
            loading={initiatingExecution}
            onClick={() => {
              confirm({
                title: "Are you sure?",
                // icon: <ExclamationCircleOutlined />,
                content: `You want to execute this campaign?`,
                onOk() {
                  executeCampaign(
                    { id: campaignDetails._id },
                    {
                      onSuccess: () => {
                        navigate(`/admin/marketing/campaign`);
                      },
                      onError: (e: any) => {
                        message.open({
                          type: "error",
                          content: e.response.data.message,
                        });
                      },
                    }
                  );
                },
                okText: "Yes, Execute",
              });
            }}
          >
            Execute Campaign
          </Button>
        ) : null,
      ]}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Form onFinish={saveCampaign} form={form} layout="vertical">
              <Stepper
                steps={[
                  {
                    title: "Title",
                    content: <CampaignForm />,
                  },
                  {
                    title: "Recipients",
                    content: <AddRecipients />,
                  },
                  {
                    title: "Template",
                    content: (
                      <Tabs
                        defaultActiveKey="1234321"
                        items={GET_TAB_ITEMS()}
                      />
                    ),
                  },
                ]}
              />
            </Form>
          </Card>
        </Col>
      </Row>
    </Header>
  );
};

export default CreateCampaign;
