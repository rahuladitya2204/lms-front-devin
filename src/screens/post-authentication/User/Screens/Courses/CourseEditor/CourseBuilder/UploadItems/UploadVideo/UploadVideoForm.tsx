import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Progress,
  Row,
  Space,
  Spin,
  Typography,
} from "@Lib/index";
import { Common, Types, User } from "@adewaskar/lms-common";
import { Fragment, useEffect, useState } from "react";
import { UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { debounce, uniqueId } from "lodash";

import ActionModal from "@Components/ActionModal/ActionModal";
import FileList from "@Components/FileList";
import Image from "@Components/Image";
import InputTags from "@Components/InputTags/InputTags";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import TextArea from "@Components/Textarea";
import ThumbnailList from "./ThumbnailList";
import UploadVideo from "./UploadVideoPopup/UploadVideo";
import { getMetadata } from "video-metadata-thumbnails";
import styled from "@emotion/styled";
import { useParams } from "@Router/index";
import useUploadItemForm from "../hooks/useUploadItemForm";

const { Title } = Typography;

const FileListStyled = styled(FileList)`
  /* ul.ant-list-items{
      display: flex !important;
    } */
`;

const UploadVideoForm: any = () => {
  const [form] = Form.useForm();
  const { id: courseId, sectionId, itemId } = useParams();
  const { onFormChange, item, handleTopicsChange, topics } =
    useUploadItemForm(form);
  const [loading, setLoading] = useState(false);
  // const jobs = item?.file?.metadata;
  const { data: file, isFetching: loadingFile } =
    User.Queries.useGetFileDetails(item.file + "", {
      enabled: !!item.file,
    });
  const videoJobId = file?.metadata?.video?.jobId;
  const {
    data: transcoding,
    // @ts-ignore
  } = User.Queries.useGetTranscodeVideoStatus(videoJobId, {
    retry: true,
    enabled: !!file?.metadata?.video,
    // @ts-ignore
    // refetchInterval: 1000
  });

  const transcribeJobId = file?.metadata?.transcription?.jobId;
  const { data: transcribing } = User.Queries.useGetTranscribeVideoStatus(
    transcribeJobId,
    {
      retry: true,
      enabled: !!transcribeJobId,
      retryDelay: 1000,
    }
  );

  const {
    mutate: generateItemInfoApi,
    isLoading: generatingSummary,
    data: generatingInfo,
  } = User.Queries.useGenerateCourseItemInfo();

  const generateItemInfo = (fields: string[]) => {
    generateItemInfoApi(
      { data: { courseId: courseId + "", itemId: itemId + "", fields } },
      {
        onSuccess: ({ summary, topics }) => {
          if (summary) {
            onFormChange({ summary: summary });
          }
          if (topics && topics.length) {
            handleTopicsChange(topics);
          }
          // console.log(topics,'123123')
          // form.setFieldValue('summary', summary);
        },
      }
    );
  };

  // useEffect(() => {
  //   // Convert topics from array of objects to array of strings
  //   const topicStrings = item.topics?.map(topic => topic.title) || []; // ADDED
  //   form.setFieldsValue({ ...item, topics: topicStrings }); // MODIFIED
  // }, [item]);

  // const handleTopicsChange = (topicStrings: string[]) => { // ADDED
  //   // Convert array of strings back to array of objects
  //   const existingTopicTitles = topics.map(t => t.title);
  //   const newTopics = topicStrings.map(title => {
  //     if (existingTopicTitles.includes(title)) {
  //       // Existing topic, return with its ID
  //       return {
  //         title,
  //         topicId: topics.find(t => t.title === title)?._id || ''
  //       };
  //     } else {
  //       // New topic, return without ID
  //       return { title, topicId: '' };
  //     }
  //   });
  //   onFormChange({ topics: newTopics });
  // };

  // console.log(transcribing,'transcribing')
  const fileId = file.encoded || file._id;
  const loadingVideo = loadingFile || loading;
  return (
    <Fragment>
      <Form
        onValuesChange={debounce(onFormChange, 700)}
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Title"
          required
          tooltip="This is a required field"
        >
          <Input placeholder="Enter Video Title" />
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={item.isPreview}
            onChange={(e) => {
              const isPreview = e.target.checked;
              onFormChange({ isPreview });
            }}
          >
            Avail this as a free lecture
          </Checkbox>
        </Form.Item>
        {/* <Form.Item
          name="topics"
          label={<span>Topics <Button loading={generatingSummary} onClick={() => generateItemInfo(['topics'])} type='primary' size='small'>Generate</Button></span>}
          rules={[{ required: true, message: "Please input your topics!" }]}
        >
          <InputTags options={topics.map(i=>(i.title))} name="topics" onChange={handleTopicsChange} ctaText='Enter Topics' /> 
        </Form.Item> */}
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Spin spinning={loadingVideo}>
              <Card
                style={{ marginTop: 20 }}
                title="Lecture Video"
                extra={[
                  <ActionModal
                    cta={
                      <Button icon={<UploadOutlined />}>
                        {file._id || item.external?.url
                          ? "Replace video"
                          : "Upload Lecture"}
                      </Button>
                    }
                  >
                    <UploadVideo
                      prefixKey={`courses/${courseId}/${itemId}/lecture/index`}
                      item={item}
                      onUpload={(item) => {
                        // console.log(item,'item')
                        onFormChange(item);
                      }}
                    />
                  </ActionModal>,
                ]}
              >
                {file._id ? (
                  <>
                    {" "}
                    <div style={{ marginBottom: 20 }}>
                      <ThumbnailList item={item} fileId={file._id} />
                    </div>
                    <Form.Item label="Thumbnail">
                      <MediaUpload
                        width={"200"}
                        source={{
                          type: "course.section.item.thumbnail",
                          value: courseId + "",
                        }}
                        uploadType="image"
                        prefixKey={`courses/${courseId}/${sectionId}/${itemId}/thumbnail}`}
                        onUpload={({ name, _id, url }) => {
                          onFormChange({
                            metadata: {
                              ...item.metadata,
                              thumbnail: url,
                            },
                          });
                        }}
                        renderItem={() => (
                          <Image
                            preview={false}
                            src={item.metadata?.thumbnail}
                          />
                        )}
                      />
                    </Form.Item>
                  </>
                ) : null}

                <Row>
                  {transcoding.status === "PROGRESSING" ? (
                    <Col span={18}>
                      <Progress
                        format={() => `Processing Video`}
                        style={{ marginBottom: 20 }}
                        percent={transcoding.progress}
                        strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                      />
                    </Col>
                  ) : null}

                  {transcribing.status === "PROGRESSING" ? (
                    <Col span={24}>
                      <Progress
                        format={() => `Generating Trancripts`}
                        style={{ marginBottom: 20 }}
                        percent={transcribing.progress}
                        strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                      />
                    </Col>
                  ) : null}
                </Row>
                {file._id ? (
                  <MediaPlayer
                    onLoadingStarted={() => setLoading(true)}
                    onLoadingEnded={() => setLoading(false)}
                    thumbnail={item.metadata?.thumbnail}
                    fileId={fileId}
                  />
                ) : item.external?.url ? (
                  <MediaPlayer
                    platform={item.external.platform}
                    url={item.external.url}
                  />
                ) : (
                  <Empty description="No Video Uploaded" />
                )}

                {file.transcription ? (
                  <>
                    {" "}
                    <Divider />
                    <Form.Item
                      name={"summary"}
                      label={
                        <span>
                          Summary{" "}
                          <Button
                            loading={generatingSummary}
                            onClick={() => generateItemInfo(["summary"])}
                            type="primary"
                            size="small"
                          >
                            Generate
                          </Button>
                        </span>
                      }
                      required
                    >
                      <TextArea html height={300} name={"summary"} />
                    </Form.Item>
                  </>
                ) : null}
              </Card>
            </Spin>
          </Col>

          <Col span={24}>
            <Card
              title="Extra Resources"
              extra={
                <ActionModal
                  processing={loadingVideo}
                  cta={<Button icon={<UploadOutlined />}> Upload Files</Button>}
                >
                  <MediaUpload
                    source={{
                      type: "course.section.item.files",
                      value: courseId + "",
                    }}
                    uploadType="file"
                    prefixKey={`courses/${courseId}/${sectionId}/${itemId}/files/${uniqueId()}`}
                    onUpload={({ name, _id }) => {
                      onFormChange({
                        files: [...item.files, { name, file: _id }],
                      });
                    }}
                  />
                </ActionModal>
              }
            >
              <FileListStyled
                onDeleteFile={(fileId: string) => {
                  const files = item.files.filter(
                    (f: any) => f.file !== fileId
                  );
                  onFormChange({ files });
                }}
                files={item.files}
              />
            </Card>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default UploadVideoForm;
