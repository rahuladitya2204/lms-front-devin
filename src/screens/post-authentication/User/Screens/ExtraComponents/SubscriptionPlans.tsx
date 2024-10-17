"use client";

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Button,
  Typography,
  Space,
  Badge,
  Modal,
} from "@Lib/index";
import { useNavigate } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function SubscriptionPlansModal() {
  const { data: subscriptionPlans, isLoading } =
    Learner.Queries.useGetGlobalPlans();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show the modal automatically after 3 seconds
    const timeout = setTimeout(() => {
      setIsModalVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleGetPlan = () => {
    if (selectedPlan) {
      navigate(`/get-plan/${selectedPlan}`);
    }
  };

  if (isLoading) {
    return <Text>Loading Plans...</Text>;
  }

  return (
    <Modal
      title="Choose Your Subscription Plan"
      visible={isModalVisible}
      onCancel={handleModalClose}
      footer={null}
      centered
      width={800}
    >
      <Row gutter={[16, 16]} justify="center">
        {subscriptionPlans?.map((plan) => (
          <Col xs={24} sm={12} md={8} key={plan._id}>
            <Badge.Ribbon
              text={plan.subscription?.type}
              // color={plan.subscription.autoRenew ? "blue" : "green"}
            >
              <Card
                title={<Title level={4}>{plan.title}</Title>}
                bordered
                style={{
                  border:
                    selectedPlan === plan._id
                      ? "2px solid #1890ff"
                      : "1px solid #d9d9d9",
                  borderRadius: "8px",
                }}
              >
                <Space direction="vertical" size="small">
                  <Text strong>Price: </Text>
                  <Text>
                    {plan.finalPrice.value} {plan.finalPrice.unit}
                  </Text>

                  <Text strong>Duration: </Text>
                  <Text>{plan.subscription.duration} days</Text>

                  {/* <Text strong>Last Updated: </Text>
                  <Text>
                    <ClockCircleOutlined /> {dayjs(plan.updatedAt).format("LL")}
                  </Text> */}

                  <Radio.Group
                    value={selectedPlan}
                    onChange={() => handlePlanSelect(plan._id)}
                    style={{ marginTop: "12px", width: "100%" }}
                  >
                    <Radio value={plan._id} style={{ width: "100%" }}>
                      Select {plan.title}
                    </Radio>
                  </Radio.Group>
                </Space>
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      {selectedPlan && (
        <Row justify="center" style={{ marginTop: "20px" }}>
          <Button type="primary" size="large" onClick={handleGetPlan}>
            Get{" "}
            {
              subscriptionPlans?.find((plan) => plan._id === selectedPlan)
                ?.title
            }
          </Button>
        </Row>
      )}
    </Modal>
  );
}
