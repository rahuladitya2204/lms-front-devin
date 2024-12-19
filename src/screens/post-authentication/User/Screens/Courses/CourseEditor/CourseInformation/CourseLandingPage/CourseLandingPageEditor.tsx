import { Button, Card, Empty, Form, Input } from "antd";
import { Fragment, useEffect, useLayoutEffect } from "react";
import { Types, User } from "@adewaskar/lms-common";

import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import MediaUpload from "@Components/MediaUpload";
import TextArea from "@Components/Textarea";
import { deepPatch } from "../../CourseBuilder/utils";
// import { patchObject } from '../../utils'
import { useParams } from "@Router/index";

interface CourseLandingPageEditorPropsI {
  // courseId: string;
  // saveCourse: Function;

  // course: Types.Course;
}

function CourseLandingPageEditor(props: CourseLandingPageEditorPropsI) {
  const { id: courseId } = useParams();
  const form = Form.useFormInstance();

  const promoVideoFile = Form.useWatch(['landingPage', 'promoVideo'], form);

  return (
    <>
      <Card
        style={{ marginTop: 20, marginBottom: 20 }}
        title="Promo Video"
        extra={[
          <MediaUpload
            source={{
              type: "course.promoVideo",
              value: courseId + "",
            }}
            prefixKey={`course/${courseId}/promo`}
            width="300px"
            name="promoVideo"
            height="250px"
            onUpload={(d) => {
              console.log(d, "eee");
              form.setFieldValue(['landingPage', 'promoVideo'], {
                file: d._id,
                url: d.url,
              });
            }}
            renderItem={() => (
              <Button>
                {promoVideoFile?.url
                  ? "Replace Promo Video"
                  : "Upload Promo Video"}
              </Button>
            )}
          // url={promoVideoFile}
          />,
        ]}
      >
        {promoVideoFile?.url ? (
          <MediaPlayer width={500} height={300} url={promoVideoFile?.url} />
        ) : (
          <Empty description="Np promo video added" />
        )}
      </Card>

      <Form.Item name={['landingPage', "description"]} required label="Landing Page Description">
        <TextArea html name={['landingPage', "description"]} />
      </Form.Item>
    </>
  );
}

export default CourseLandingPageEditor;
