import { Common, Learner, Store, User } from "@adewaskar/lms-common";

import Image from "./Image";
import { Skeleton, Space } from "antd";
import { Typography } from "@Components/Typography";
const { Text } = Typography;
interface OrgLogoPropsI {
  quality?: "low" | "high";
  noLoadNoShow?: boolean;
  width?: string | number;
  style?: any;
  onClick?: Function;
  showName?: boolean;
}

function OrgLogo(props: OrgLogoPropsI) {
  // const navigate = useNavigate()
  const { data: organisation } = Learner.Queries.useGetOrgDetails();
  const logo = organisation?.branding?.logo;
  const SkeletonButton = (
    <Skeleton.Avatar active style={{ width: 45, height: 45 }} />
  );
  if (!logo) {
    return null;
  }
  return !organisation._id ? (
    SkeletonButton
  ) : (
    <Space>
      {/* @ts-ignore */}
      <Image
        noLoadNoShow
        noLoadNoShowPlaceholder={organisation._id ? SkeletonButton : <span />}
        style={{ cursor: "pointer", margin: "auto", ...(props.style || {}) }}
        width={props.width || `45px`}
        preview={false}
        // @ts-ignore
        src={logo[props.quality ? props.quality : "low"].url}
        alt={organisation.name}
        {...props}
      />
      {props.showName ? (
        <Text style={{ fontSize: 26 }}>{organisation.name}</Text>
      ) : null}
    </Space>
  );
}

export default OrgLogo;
