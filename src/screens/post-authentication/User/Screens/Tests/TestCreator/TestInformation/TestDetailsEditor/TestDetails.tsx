import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  TreeSelect,
} from "antd";
import { Constants, Enum, Types, User, Utils } from "@adewaskar/lms-common";
import { useCallback, useEffect, useMemo } from "react";

import Image from "@Components/Image";
import MediaUpload from "@Components/MediaUpload";
import SelectProductCategory from "@Components/SelectProductCategory";
import dayjs from "dayjs";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useParams } from "react-router";
import TextArea from "@Components/Textarea";
import FileList from "@Components/FileList";
import { TopicNode } from "@User/Screens/Admin/Topics/TopicsScreen";
import InputTags from "@Components/InputTags/InputTags";
import TopicSelect, { getFullTopicPath } from "@Components/TopicSelect";
import { capitalize } from "lodash";
import ValidateProductSlug from "@User/Screens/ExtraComponents/ValidateProductSlug";

const { useWatch } = Form;

interface TestDetailsEditorPropsI {
  // testId?: string;
  // saveTest: Function;
  // test: Types.Test;
}

function TestDetailsEditor(props: TestDetailsEditorPropsI) {
  const { id: testId } = useParams();

  const form = Form.useFormInstance();
  const image = useWatch(["thumbnailImage"], form);
  const status = useWatch(["status"], form);
  const isPyqEnabled = useWatch(["pyq", "enabled"], form);
  const { mutateAsync: validateSlugApi, status: validatingStatus } =
    User.Queries.useValidateSlug("test");
  const isDurationEnabled = useWatch(["duration", "enabled"], form);
  const cat = useWatch(["category"], form);
  const { listItems: categories, data: categoriesData } =
    User.Queries.useGetProductCategories("test");
  const { data: testDetail, isFetching: loadingTest } =
    User.Queries.useGetTestDetails(testId + "", {
      enabled: !!testId,
    });
  const category = useMemo(() => {
    return categoriesData.find((c) => c._id === cat);
  }, [categoriesData, cat]);

  const onValuesChange = (d: Partial<Types.Test>) => {
    // const data = deepPatch(test, d);
    form.setFieldsValue(d);
  };

  const isPublished = status === Enum.TestStatus.PUBLISHED;
  const isLive = Form.useWatch(["live", "enabled"], form);
  const files = Form.useWatch(["files"], form);
  const isHandwritten =
    Form.useWatch(["input", "type"], form) === Enum.TestInputType.HANDWRITTEN;
  return (
    <>
      {/* <Form.Item name={['status']} required label="Test Status">
        <Select style={{ width: 200 }} placeholder="Select Status`">
          {STATUSES.map((category: any) => {
            return (
              <Option
                key={category.value}
                value={category.value}
                label={category.label}
              >
                {category.label}
              </Option>
            )
          })}
        </Select>
      </Form.Item> */}
      <Form.Item name="thumbnailImage" required label="Thumbnail">
        <MediaUpload
          source={{
            type: "test.image",
            value: testId + "",
          }}
          uploadType="image"
          compress={{ quality: 0.8, maxHeight: 200, maxWidth: 330 }}
          cropper={{ width: 330, height: 200 }}
          aspect={16 / 9}
          name="thumbnailImage"
          width="200px"
          height="300px"
          prefixKey={`Tests/${testId}/thumbnailImage`}
          renderItem={() => <Image alt={testId} preview={false} src={image} />}
          onUpload={(e) => {
            form.setFieldsValue({ thumbnailImage: e.url });
          }}
        />
      </Form.Item>

      <Form.Item
        name="title"
        required
        label="Title"
        rules={[
          { required: true, message: "Please enter a title for the Test" },
        ]}
      >
        <Input />
      </Form.Item>

      <ValidateProductSlug product={{
        type: 'test',
        id: testId + ''
      }} />

      <Form.Item name="subtitle" label="Subtitle">
        <Input />
      </Form.Item>
      <Form.Item name={"keywords"} label="Keywords">
        <InputTags name={`keywords`} />
      </Form.Item>
      <Form.Item name="files" required label="Files">
        <MediaUpload
          uploadType="file"
          prefixKey={`Tests/${testId}/files`}
          onUpload={({ name, _id }) => {
            onValuesChange({
              files: [...files, { name, file: _id }],
            });
          }}
        />
        <FileList
          onDeleteFile={(fileId: string) => {
            const FILES = files.filter((f: any) => f.file !== fileId);
            onValuesChange({ files: FILES });
          }}
          files={files}
        />
      </Form.Item>
      <Divider />
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            label="Previous Year Questions"
            style={{ margin: 0 }}
            valuePropName="checked"
            name={["pyq", "enabled"]}
          // label="Send email to learner on course enrollment."
          >
            <Switch
            // checkedChildren="PYQ"
            // unCheckedChildren="No Pyq"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label='AI Traning'
            name={['aiTraining', 'enabled']}
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Col>
        {isPyqEnabled ? (
          <>
            <Col span={8}>
              <Form.Item
                label="PYQ Year"
                style={{ margin: 0 }}
                // valuePropName="checked"
                name={["pyq", "year"]}
              // label="Send email to learner on course enrollment."
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Paper Notes"
                style={{ margin: 0 }}
                name={["pyq", "notes"]}
              // label="Send email to learner on course enrollment."
              >
                <TextArea height={400} html={{ level: 3 }} />
              </Form.Item>
            </Col>
          </>
        ) : null}
      </Row>
      <Divider />
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please enter minimum passing score'
            //   }
            // ]}
            name="passingScore"
            label="Minimum Passing Score"
          // required
          >
            <Input
              type="number"
              placeholder="Please enter minimum passing score"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // label=""
            label={
              <Space>
                Duration(in minutes){" "}
                {/* {isPublished ? '(Cannot change duration once published)' : ''}{' '} */}
                <Form.Item
                  style={{ margin: 0 }}
                  valuePropName="checked"
                  name={["duration", "enabled"]}
                // label="Send email to learner on course enrollment."
                >
                  <Switch
                    checkedChildren="Enabled"
                    unCheckedChildren="No Duration"
                  />
                </Form.Item>
              </Space>
            }
            name={["duration", "value"]}
            rules={[{ required: true, message: "Please select duration!" }]}
          >
            <Input
              // readOnly={isPublished}
              disabled={!isDurationEnabled}
              type="number"
              placeholder="Enter duration in mins"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            // label=""
            label={`Input Type`}
            name={["input", "type"]}
            rules={[
              { required: true, message: "Please select user input mode" },
            ]}
          >
            <Select
              options={[
                {
                  label: "Handwritten Images",
                  value: Enum.TestInputType.HANDWRITTEN,
                },
                {
                  label: "Keyboard",
                  value: Enum.TestInputType.KEYBOARD,
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <TopicSelect
            level={4}
            topicId={[]}
            name="topics"
            label="Topics"
          ></TopicSelect>
        </Col>
        <Col span={8}>
          <Form.Item label="Status" style={{ margin: 0 }} name={["status"]}>
            <Select
              options={[
                {
                  label: capitalize(Enum.TestStatus.DRAFT),
                  value: Enum.TestStatus.DRAFT,
                },
                {
                  label: capitalize(Enum.TestStatus.ENDED),
                  value: Enum.TestStatus.ENDED,
                },
                {
                  label: capitalize(Enum.TestStatus.PUBLISHED),
                  value: Enum.TestStatus.PUBLISHED,
                },
                {
                  label: capitalize(Enum.TestStatus.LIVE),
                  value: Enum.TestStatus.LIVE,
                },
              ]}
            />
          </Form.Item>
        </Col>
        {isHandwritten ? (
          <Col span={8}>
            <Form.Item
              // label=""
              label={`Evaluation Mode`}
              name={["evaluation", "mode"]}
              rules={[
                { required: true, message: "Please select evaluation mode" },
              ]}
            >
              <Select
                options={[
                  {
                    label: "Manual",
                    value: Enum.TestEvaluationMode.MANUAL,
                  },
                  {
                    label: "Automatic",
                    value: Enum.TestEvaluationMode.AUTOMATIC,
                  },
                ]}
              />
            </Form.Item>
          </Col>
        ) : null}
        <Col span={12}>
          <Row gutter={[0, 20]} justify={"end"}>
            <Col flex={1}>
              <Form.Item
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter start time for the live test",
                //   },
                // ]}
                name={["live", "scheduledAt"]}
                style={{ width: "100%" }}
                label={
                  <Row align="middle" justify={"space-between"}>
                    <Col flex={1}>
                      {isLive
                        ? "Schedule Date"
                        : `Live ${isPublished
                          ? "(Cannot change date/time once published)"
                          : ""
                        }`}
                    </Col>
                    <Col>
                      <Form.Item
                        style={{ margin: 0, marginLeft: 10 }}
                        valuePropName="checked"
                        name={["live", "enabled"]}
                      // label="Send email to learner on course enrollment."
                      >
                        <Switch checkedChildren="Live" unCheckedChildren="No" />
                      </Form.Item>
                    </Col>
                  </Row>
                }
                required
              >
                {isLive ? (
                  <DatePicker
                    style={{ width: "100%" }}
                    disabled={isPublished}
                    showTime
                  />
                ) : null}
              </Form.Item>
            </Col>
          </Row>
        </Col>
        {/* <Col span={12}>
          <Form.Item style={{ margin: 0 }} name={['mode']} label="Test Mode">
            <Select
              options={[
                {
                  label: 'Online',
                  value: `online`
                },
                {
                  label: 'Offline',
                  value: `offline`
                }
              ]}
            />
          </Form.Item>
        </Col> */}
        {isLive ? (
          <Col span={8}>
            <Form.Item
              label="Select Result Trigger"
              name={["live", "result", "trigger"]}
            >
              <Select
                showSearch
                placeholder="Select Result Trigger"
                options={[
                  { label: "Manual", value: "manual" },
                  { label: "Immediate", value: "immediate" },
                ]}
              />
            </Form.Item>
          </Col>
        ) : null}
      </Row>
      <Divider />
      <Row>
        <Col span={8}>
          <Form.Item
            style={{ margin: 0, marginLeft: 10 }}
            valuePropName="checked"
            name={["promotion", "enabled"]}
            label="Promoted"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            style={{ margin: 0, marginLeft: 10 }}
            valuePropName="checked"
            name={["purchase", "enabled"]}
            label="Purchase Enabled"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[40, 20]}>
        <Col span={8}>
          <Form.Item
            name="languages"
            required
            label="Languages"
            rules={[{ required: true, message: "Please select a language" }]}
          >
            <Select
              mode="multiple"
              showSearch
              placeholder="Select Language"
              options={Constants.LANGUAGES}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <SelectProductCategory name={["category"]} />
        </Col>
      </Row>
    </>
  );
}

export default TestDetailsEditor;

export const useBuildTopicTree = (
  topic: string | string[] | null,   // ← now allows null
  level = 3,
  notDisabled?: boolean
) => {
  /**
   * Normalise the incoming topic argument:
   *   • null / undefined  →  []
   *   • string            →  [string]
   *   • string[]          →  string[]
   */
  const topicIds: string[] = topic == null
    ? []                       // fetch from the root
    : Array.isArray(topic)
      ? topic
      : [topic];

  // When topicIds is an empty array we want the root‑level tree.
  // `useGetTopicTree` already interprets [] as “start from the root”,
  // so we can pass it through directly.
  const { data: TOPIC_TREE_DATA, isLoading } = User.Queries.useGetTopicTree(
    topicIds,
    level,
    notDisabled
  );

  /** Convert a topicId into its full path (e.g. "Maths → Algebra → Quadratics") */
  const getFullTopicPath = useCallback(
    (topicId: string): string => {
      if (!TOPIC_TREE_DATA || !topicId) return '';

      /* ---- build a flat lookup map from the tree ---- */
      const topicMap: Record<string, any> = {};
      const buildMap = (node: any) => {
        topicMap[node._id] = node;
        node.children?.forEach(buildMap);
      };
      TOPIC_TREE_DATA.forEach(buildMap);

      /* ---- climb up the ancestry chain ---- */
      const path: string[] = [];
      const visited = new Set<string>();
      let currentId: string | undefined = topicId;

      while (currentId && !visited.has(currentId)) {
        visited.add(currentId);
        const node = topicMap[currentId];
        if (!node) break;
        path.push(node.title?.eng || '[Unknown Topic]');
        currentId = node.parentId;
      }

      return path.reverse().join(' → ');
    },
    [TOPIC_TREE_DATA]
  );

  return { data: TOPIC_TREE_DATA, isLoading, getFullTopicPath };
};

export const buildTopicTree = (
  topics: Types.Topic[],
  topicId?: string,
  level?: number
) => {
  const buildTreeData = (
    topics: Types.Topic[],
    parentId?: string,
    currentLevel: number = 1
  ) => {
    if (parentId) {
      return buildSubTreeData(parentId, topics, currentLevel);
    } else {
      // @ts-ignore
      return topics
        .filter((topic) => !topic.parentId)
        .map((topic) => {
          const children =
            level === undefined || currentLevel < level
              ? buildSubTreeData(topic._id + "", topics, currentLevel + 1)
              : [];
          return {
            ...topic,
            value: topic._id,
            title: topic.title,
            disabled:
              level !== undefined &&
              currentLevel === level - 1 &&
              children.length > 0,
            children,
          };
        });
    }
  };

  const buildSubTreeData = (
    parentId: string,
    topics: Types.Topic[],
    currentLevel: number
  ): TopicNode[] => {
    const subTopics = topics
      .filter((topic) => topic.parentId === parentId)
      .map((topic) => {
        const children =
          level === undefined || currentLevel < level
            ? buildSubTreeData(topic._id + "", topics, currentLevel + 1)
            : [];
        return {
          ...topic,
          value: topic._id,
          title: topic.title,
          disabled:
            level !== undefined &&
            currentLevel === level - 1 &&
            children.length > 0,
          children,
        };
      });
    // @ts-ignore
    return [...subTopics];
  };

  return buildTreeData(topics, topicId);
};
