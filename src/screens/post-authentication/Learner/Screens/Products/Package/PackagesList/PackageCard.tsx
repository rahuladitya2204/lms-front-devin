import { Card, Progress, Space, Tag } from "antd";
import { Enum, Learner, Types } from "@adewaskar/lms-common";

import Image from "@Components/Image";
import { Typography } from "@Components/Typography";
import dayjs from "dayjs";
import styled from "@emotion/styled";

const { Text } = Typography;

interface PackageCardPropsI {
    packageId: string;
    enrolledProduct: Types.EnrolledProductDetails;
    progress: number;
    onClick: () => void;
}

const CardHolder = styled(Card)`
  cursor: pointer;

  .ant-card-cover {
    height: 200px !important;
  }
`;

const PackageCard: React.FC<PackageCardPropsI> = (props) => {
    const {
        data: { progress },
    } = Learner.Queries.useGetEnrolledProductDetails(
        {
            type: Enum.ProductType.PACKAGE,
            id: props.packageId,
        },
        {
            enabled: !!props.packageId,
        }
    );
    const { enrolledProduct } = props;
    const { data: packageDetails } = Learner.Queries.useGetPackageDetails(props.packageId);
    return (
        <CardHolder
            hoverable
            onClick={props.onClick}
            bodyStyle={{ padding: 10 }}
            cover={
                <Image alt={packageDetails.title} height={180} src={packageDetails.thumbnailImage} />
            }
        >
            <Card.Meta
                // avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                title={
                    <Space direction="vertical">
                        <Text style={{ fontSize: 13 }}>
                            Started {dayjs(enrolledProduct.enrolledAt).format("MMMM D, YYYY")}
                        </Text>
                    </Space>
                }
                description={<Text strong>{packageDetails.title}</Text>}
            />
            <Progress percent={progress} />
            {enrolledProduct.plan.expiresAt ? (
                <Tag color="blue">
                    Expires at{" "}
                    {dayjs(enrolledProduct.plan.expiresAt).format("MMMM D, YYYY")}
                </Tag>
            ) : null}
        </CardHolder>
    );
};

export default PackageCard;
