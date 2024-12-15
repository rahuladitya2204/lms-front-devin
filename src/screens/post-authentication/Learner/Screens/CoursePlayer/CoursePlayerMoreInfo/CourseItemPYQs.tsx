import {
    Avatar,
    Button,
    Card,
    Col,
    Divider,
    List,
    Row,
    Skeleton,
    Tag,
} from "antd";
import { Constants, Learner, Store, Types } from "@adewaskar/lms-common";

import { Typography } from "@Components/Typography";
import { useParams } from "@Router/index";
import { Title } from "@Components/Typography/Typography";

const { Text } = Typography;

interface CourseItemPYQsPropsI {
    course: Types.Course;
    itemId: string;
}
const CourseItemPYQs: React.FC<CourseItemPYQsPropsI> = (props) => {
    // const playerInstance = Store.usePlayer(s => s.state.playerInstance)
    const { course } = props;
    const { itemId, id: courseId } = useParams();
    const {
        data: pyqs,
        isLoading: loadingNotes,
        isFetching: fetchingNotes,
    } = Learner.Queries.useGetCourseItemPYQs(
        courseId + '',
        itemId + ''
    );

    return (
        <Row>
            <Col span={24}>
                <Title level={4}>
                    Previous Year Questions
                </Title>
            </Col>
        </Row>
    );
};

export default CourseItemPYQs;
