import { Alert, Button, Card, Empty, Form, Input, Space } from "antd";

import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import SelectThumbnail from "@Components/SelectThumbnail";
import { Text } from "@Components/Typography/Typography";
import TextArea from "@Components/Textarea";
//
import { Types } from "@adewaskar/lms-common";
import { deepPatch } from "@User/Screens/Courses/CourseEditor/CourseBuilder/utils";
import { useLayoutEffect } from "react";
// import { patchObject } from '../../utils'
import { useParams } from "@Router/index";
import InputTags from "@Components/InputTags/InputTags";

interface TestLandingPageEditorPropsI { }

function TestLandingPageEditor(props: TestLandingPageEditorPropsI) {
  const { id: testId } = useParams();

  const form = Form.useFormInstance();
  const promoVideoFile = Form.useWatch(["landingPage", "promoVideo"], form);

  const landingPageDescription = Form.useWatch(["description"], form);

  const landingPageLength = landingPageDescription?.length;
  return (
    <>
      <Card
        style={{ marginTop: 20, marginBottom: 20 }}
        title="Promo Video"
        extra={[
          <MediaUpload
            source={{
              type: "test.promoVideo",
              value: testId + "",
            }}
            prefixKey={`Tests/${testId}/promo`}
            width="300px"
            name={["landingPage", "promoVideo"]}
            height="250px"
            onUpload={(d) => {
              console.log(d, "eee");
              form.setFieldValue(["landingPage", "promoVideo"], {
                file: d._id,
                url: d.url,
              });
            }}
            renderItem={() => (
              <Button>
                {promoVideoFile ? "Replace Promo Video" : "Upload Promo Video"}
              </Button>
            )}
          // url={promoVideoFile}
          />,
        ]}
      >
        <Space style={{ marginBottom: 20 }}>
          <SelectThumbnail
            onSelect={(e) => {
              console.log(e, "e");
              form.setFieldValue(["landingPage", "promoVideo"], {
                ...promoVideoFile,
                thumbnailImage: e.url,
              });
            }}
            url={promoVideoFile?.url}
          />
        </Space>
        {promoVideoFile?.url ? (
          <MediaPlayer width={500} height={300} url={promoVideoFile.url} />
        ) : (
          <Empty description="Np promo video added" />
        )}
      </Card>
      {/* <Form.Item
        name={"keywords"}
        label="Keywords"
        // rules={[
        //   {
        //     required: true,
        //     message: "Please enter a description for the Test",
        //   },
        // ]}
      >
        <InputTags name={`keywords`} />
      </Form.Item> */}
      {landingPageLength < 200 ? (
        <Alert
          style={{ marginBottom: 10 }}
          type="error"
          message="Note minimum 200 words needed to display landing page text"
        />
      ) : null}
      <Form.Item
        name={["landingPage", "description"]}
        required
        label={
          <>
            <Text>Landing Page Description</Text>
            {landingPageLength ? (
              <div>
                {" "}
                - <Text type="danger">{landingPageLength} words</Text>
              </div>
            ) : null}
          </>
        }
      >
        <TextArea name={["landingPage", "description"]} html />
      </Form.Item>
    </>
  );
}

export default TestLandingPageEditor;
