import { Button, Form, Select, Spin, Switch } from "antd";
import { Enum, User } from "@adewaskar/lms-common";
import { useEffect, useMemo, useState } from "react";

import CreateTest from "./CreateTest";
import Header from "@User/Screens/UserRoot/UserHeader";
import TestsList from "./TestsList";
import useBreakpoint from "@Hooks/useBreakpoint";
import { useModal } from "@Components/ActionModal/ModalContext";

const TestsScreen = () => {
  const [status, setStatus] = useState("upcoming");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("non-category");

  const { isMobile } = useBreakpoint();
  const { openModal } = useModal();

  const { data: categories = [], isLoading: loadingCategories } =
    User.Queries.useGetProductCategories("all");

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
  };

  const CreateCourseCta = (
    <Button onClick={() => openModal(<CreateTest />)} type="primary">
      Create Test
    </Button>
  );

  const categoryOptions = useMemo(() => {
    return [
      <Select.Option key="non-category" value="non-category">
        All Categories
      </Select.Option>,
      ...categories.map((c) => (
        <Select.Option key={c._id} value={c._id}>
          {c.title}
        </Select.Option>
      )),
    ];
  }, [categories]);

  const statusOptions = (
    <Select
      onChange={handleStatusChange}
      value={status}
      style={{ width: isMobile ? "100%" : 150, marginRight: 12 }}
    >
      <Select.Option value="upcoming">Upcoming Tests</Select.Option>
      <Select.Option value="past">Past Tests</Select.Option>
    </Select>
  );

  const categoryDropdown = (
    <Select
      onChange={handleCategoryChange}
      value={selectedCategoryId}
      style={{ width: isMobile ? "100%" : 200 }}
      placeholder="Select Category"
    >
      {categoryOptions}
    </Select>
  );

  const getFilter = () => {
    const baseStatus =
      status === "upcoming"
        ? [
          Enum.TestStatus.DRAFT,
          Enum.TestStatus.PUBLISHED,
          Enum.TestStatus.IN_PROGRESS,
          Enum.TestStatus.LIVE,
        ]
        : [Enum.TestStatus.ENDED];

    const filter: any = { status: baseStatus };
    if (selectedCategoryId !== "non-category") {
      filter.category = selectedCategoryId;
    }
    return filter;
  };
  const [isPYQ, setIsPYQ] = useState(false);
  const [isAITraining, setIsAITraining] = useState(false)

  return (
    <Header title="Tests" extra={[CreateCourseCta]}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {statusOptions}
        {categoryDropdown}
        <Form.Item label="Previous Year Questions">
          <Switch
            checked={!!isPYQ}
            onChange={(e) => {
              setIsPYQ(e);
            }}
          />
        </Form.Item>,
        <Form.Item label="AI Training">
          <Switch
            checked={!!isAITraining}
            onChange={(e) => {
              setIsAITraining(e);
            }}
          />
        </Form.Item>
      </div>
      <Spin spinning={loadingCategories}>
        {/* @ts-ignore */}
        <TestsList isPYQ={isPYQ} isAITraining={isAITraining} filter={getFilter()} />
      </Spin>
    </Header>
  );
};

export default TestsScreen;
