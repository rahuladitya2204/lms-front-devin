import { Card, Col, List, Row, Skeleton } from "antd";
import { Common, Learner, Types } from "@adewaskar/lms-common";

import { Fragment } from "react";
import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import Image from "@Components/Image";
import MediaPlayer from "@Components/MediaPlayer/MediaPlayer";
import TestimonialCard from "@Components/TestimonialCard";
import { Typography } from "@Components/Typography";

const { Title, Paragraph } = Typography;

interface PackageOverviewPropsI {
  package: Types.Package;
  hidePreview?: boolean;
}

function PackageOverview(props: PackageOverviewPropsI) {
  const packageId = props.package.slug;

  const { data: bundle, isFetching: loadingPackage } =
    Learner.Queries.useGetPackageDetails(packageId, {
      enabled: !!packageId,
    });

  const { landingPage } = bundle;
  return (
    <Fragment>
      <Row gutter={[30, 30]}>
        {!props.hidePreview && landingPage?.promoVideo?.url ? (
          <Col span={24}>
            <Card
              style={{ margin: "20px 0" }}
              bordered={false}
              bodyStyle={{ padding: 0 }}
            >
              <MediaPlayer height={400} url={landingPage?.promoVideo?.url} />
            </Card>
          </Col>
        ) : null}
        <Col span={24}>
          {loadingPackage ? (
            <Skeleton paragraph={{ rows: 30 }} active />
          ) : (
            <Paragraph style={{ fontSize: 16 }}>
              <HtmlViewer content={landingPage.description} />
            </Paragraph>
          )}
        </Col>
        {bundle.testimonials.length ? (
          <Col span={24}>
            <Title level={3}>Testimonials</Title>
            <Row gutter={[20, 30]}>
              {bundle.testimonials.map((testimonial) => {
                return (
                  <Col sm={12} xs={24} md={8}>
                    <TestimonialCard testimonial={testimonial} />
                  </Col>
                );
              })}
            </Row>
          </Col>
        ) : null}
      </Row>
    </Fragment>
  );
}

export default PackageOverview;
