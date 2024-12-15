import { Common, Enum, Learner, Store } from "@adewaskar/lms-common";
import { Fragment, useMemo, useState } from "react";

import CoursePlayerQuiz from "./CoursePlayerItems/CourseQuizItem/QuizItem";
import CoursePlayerTextItem from "./CoursePlayerItems/Text";
import ErrorBoundary from "@Components/ErrorBoundary";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import PDFViewer from "@Components/PDFViewer";
import { Card, Col, Row, Skeleton, Spin } from "antd";

import { useParams } from "@Router/index";
import { useOutletContext } from "react-router";
import CoursePlayerMoreInfo from "./CoursePlayerMoreInfo";

function CoursePlayerItem() {
  const [loading, setLoading] = useState(false);
  const { mutate: updateProgress } = Learner.Queries.useUpdateCourseProgress();
  const { data: user } = Learner.Queries.useGetLearnerDetails();
  const WATERMERK = useMemo(() => {
    return ` <div>
  <p>${user.name}</p>
  <p>${user.contactNo}</p>
</div>`;
  }, [user]);
  const [, , language] = useOutletContext();
  const { id: courseId, itemId } = useParams();
  const { data: item, isLoading } = Learner.Queries.useGetCourseItemDetails(
    courseId + "",
    itemId + "",
    language, {
    enabled: !!language
  }
  );
  const onEnd = () => {
    updateProgress({
      courseId: courseId + "",
      sectionId: "" + "",
      action: "ADD",
      itemId: item._id,
      data: null,
    });
  };

  const {
    data: {
      metadata: { course: {
        notes
      } },
    },
    isLoading: loadingEnrolledProduct
  } = Learner.Queries.useGetEnrolledProductDetails(
    {
      type: Enum.ProductType.COURSE,
      id: courseId + "",
    },
    {
      enabled: !!courseId,
    }
  );

  const { data: course } = Learner.Queries.useGetCourseDetails(courseId + "");
  const { data: file, isFetching: loadingFile } =
    Learner.Queries.useGetFileDetails(item.file + "", {
      enabled: !!item.file,
    });
  const currentItemNotes = notes.filter((note) => note.item === item._id) || [];
  const LOADING = isLoading || loadingEnrolledProduct;
  let Component;
  if (item.type === "text") {
    Component = <CoursePlayerTextItem item={item} />;
  }

  if (item.type === "quiz") {
    Component = <CoursePlayerQuiz onEnd={onEnd} item={item} />;
  }
  const fileId = file.encoded || file._id;
  if (item.type === "video") {
    Component = !item.external?.url ? (
      <MediaPlayer
        onLoadingStarted={() => setLoading(true)}
        onLoadingEnded={() => setLoading(false)}
        hls
        thumbnail={item.metadata?.thumbnail}
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        fileId={fileId}
        height={550}
      />
    ) : (
      <MediaPlayer
        hls
        onLoadingStarted={() => setLoading(true)}
        onLoadingEnded={() => setLoading(false)}
        thumbnail={item.metadata?.thumbnail}
        notes={currentItemNotes}
        watermark={course.advanced.watermark?.enabled ? WATERMERK : null}
        platform={item.external?.platform}
        url={item.external?.url}
        height={550}
      />
    );
  }

  if (item.type === "pdf") {
    Component = <PDFViewer file={file} />;
  }
  return (
    // @ts-ignore
    <ErrorBoundary fallbackComponent={Component}>
      <Spin spinning={loading || loadingFile}>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <div
              style={{
                // height: 550,
                width: "100%",
              }}
            >
              {LOADING ? <Row gutter={[20, 30]}>
                <Col span={24}>
                  <Skeleton.Button block active style={{
                    width: '100%',
                    height: 500

                  }} /> </Col>
                <Col span={24}>
                  <Skeleton.Button block active style={{
                    width: '100%',
                    height: 200
                  }} /> </Col>
              </Row> : Component}
            </div></Col>
          {LOADING ? null : <Col span={24}>
            <Card>
              <CoursePlayerMoreInfo course={course} itemId={itemId + ''} />
            </Card>
          </Col>}
        </Row>
      </Spin>
    </ErrorBoundary>
  );
}

export default CoursePlayerItem;
