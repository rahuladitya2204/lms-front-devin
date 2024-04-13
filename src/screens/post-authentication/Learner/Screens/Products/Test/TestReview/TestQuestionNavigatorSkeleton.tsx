import { Card, Col, Row, Skeleton } from "antd";

interface TestQuestionNavigatorSkeletonPropsI {}

export default function TestQuestionNavigatorSkeleton(
  props: TestQuestionNavigatorSkeletonPropsI
) {
  return (
    <Card
      // style={{ height: '80vh' }}
      bodyStyle={{
        // overflow: 'scroll',
        // height: '100%',
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Row>
        {[
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1,
        ].map(() => (
          <Col span={3}>
            <Skeleton.Button
              active
              block
              style={{ width: 32, height: 32, borderRadius: 32 }}
            />
          </Col>
        ))}
      </Row>
    </Card>
  );
}
