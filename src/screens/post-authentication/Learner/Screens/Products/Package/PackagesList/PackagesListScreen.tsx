"use client";

import HtmlViewer from "@Components/HtmlViewer/HtmlViewer";
import { Title } from "@Components/Typography/Typography";
import { useNavigate, useParams } from "@Router/index";
import { Learner } from "@adewaskar/lms-common";
import { Button, Card, Col, Row, Skeleton } from "antd";
import { FAQsList } from "@Components/CreateFaqsComponent";
import PackageCard from "../../../StoreScreen/Cards/PackageCard";
import TestCard from "@User/Screens/Tests/TestsList/TestCard";

interface PackageDetailViewerPropsI {
  isServer?: boolean;
  children?: React.ReactNode;
  slug?: string;
}

export default function PackagesList(props: PackageDetailViewerPropsI) {
  const params = useParams();
  const slug = props.slug || params.slug;
  const { data: category } =
    Learner.Queries.useGetProductCategoryDetailsFromTestSeriesSlug(slug + "");
  console.log(category, "category");
  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Title>{category?.testSeries?.page?.title}</Title>
      </Col>
      <Col span={24}>
        <PackageListComponent isServer={props.isServer} id={category._id} />
      </Col>
      {category?.testSeries?.page?.content ? (
        <Col span={24}>
          <Card>
            <HtmlViewer content={category?.testSeries?.page?.content} />
          </Card>
        </Col>
      ) : null}
      {category.testSeries.faqs.length ? (
        <Col span={24}>
          <Card title="FAQs">
            <FAQsList faqs={category.testSeries.faqs} />
          </Card>
        </Col>
      ) : null}
    </Row>
  );
}

export const PackageListComponent = (props: {
  id: string;
  isServer?: boolean;
  showAll?: boolean;
}) => {
  const navigate = useNavigate();
  const id = props.id;
  const { data: packages, isLoading: loadingPackages } =
    Learner.Queries.useGetPackages(id + "", {
      enabled: !!id,
    });
  const { data: category } = Learner.Queries.useGetProductCategoryDetails(id);
  return (
    <Row gutter={[20, 20]}>
      {loadingPackages ? (
        [1, 1, 1, 1, 1, 1].map((i, idx) => (
          <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={6} xxl={6}>
            <Skeleton.Button active block style={{ height: 110 }} />
          </Col>
        ))
      ) : (
        <>
          {packages.map((bundle, idx) => {
            return (
              <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={6} xxl={6}>
                <PackageCard mini isServer={props.isServer} package={bundle} />
              </Col>
            );
          })}
          {props.showAll ? (
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                onClick={() => {
                  if (props.isServer) {
                    navigate(`/test-series/${category.testSeries.page.slug}`);
                  } else {
                    navigate(
                      `/app/test-series/${category.testSeries.page.slug}`
                    );
                  }
                }}
                type="dashed"
                size="small"
              >
                View All Test Series
              </Button>
            </Col>
          ) : null}
        </>
      )}
    </Row>
  );
};

// export const TestListComponent = (props: {
//   id: string;
//   isServer?: boolean;
//   showAll?: boolean;
// }) => {
//   const navigate = useNavigate();
//   const id = props.id;
//   const { data: tests, isLoading: loadingTests } = Learner.Queries.useGetTests(
//     // @ts-ignore
//     {
//       category: id + "",
//       // status: [Enum],
//     },
//     {
//       enabled: !!id,
//     }
//   );
//   const { data: category } = Learner.Queries.useGetProductCategoryDetails(id);
//   return (
//     <Row gutter={[20, 20]}>
//       {loadingTests ? (
//         [1, 1, 1, 1, 1, 1].map((i, idx) => (
//           <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={8} xxl={6}>
//             <Skeleton.Button active block style={{ height: 110 }} />
//           </Col>
//         ))
//       ) : (
//         <>
//           {tests.map((test, idx) => {
//             const TestComponent = (
//               <TestCard mini isServer={props.isServer} test={test} />
//             );
//             return (
//               <Col sm={12} key={idx} md={12} xs={24} lg={12} xl={8} xxl={6}>
//                 {test.plan.type === "free" ? (
//                   <Badge.Ribbon text="Free" placement="start">
//                     {TestComponent}
//                   </Badge.Ribbon>
//                 ) : (
//                   TestComponent
//                 )}
//               </Col>
//             );
//           })}
//           {props.showAll ? (
//             <Col
//               span={24}
//               style={{ display: "flex", justifyContent: "center" }}
//             >
//               <Button
//                 onClick={() => {
//                   if (props.isServer) {
//                     navigate(`/test/${category.testSeries.page.slug}`);
//                   } else {
//                     navigate(`/app/test/${category.testSeries.page.slug}`);
//                   }
//                 }}
//                 type="dashed"
//                 size="small"
//               >
//                 View All Tests
//               </Button>
//             </Col>
//           ) : null}
//         </>
//       )}
//     </Row>
//   );
// };
