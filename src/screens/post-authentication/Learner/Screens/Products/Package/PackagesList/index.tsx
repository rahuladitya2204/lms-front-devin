import { Enum, Learner } from '@adewaskar/lms-common';
import { useNavigate } from '@Router/index';
import { Card, Col, Row, Skeleton, Tabs, Typography } from 'antd'
import PackageCard from './PackageCard';



const { Title } = Typography

const LearnerPackages: React.FC = () => {
    const { data: enrolledPackages, isFetching: loading } =
        Learner.Queries.useGetEnrolledProductList(Enum.ProductType.PACKAGE);
    const navigate = useNavigate();
    return (
        <Card>
            <Row gutter={[20, 20]}>
                {loading ? [1, 1, 1, 1, 1, 1].map((i, idx) => (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Skeleton.Button active block style={{ height: 200 }} />
                    </Col>
                )) : enrolledPackages.map((enrolledProduct) => (
                    <Col xs={24} sm={12} md={8} lg={6}>
                        {" "}
                        <PackageCard
                            onClick={() =>
                                navigate(`/app/${enrolledProduct.product.id}/enrolled-package`)
                            }
                            packageId={enrolledProduct.product.id}
                            enrolledProduct={enrolledProduct}
                            progress={enrolledProduct.progress}
                        />
                    </Col>
                ))}
            </Row>
        </Card>
    )
}

export default LearnerPackages
