import {
  FacebookOutlined,
  GoogleOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  MailOutlined,
  MessageOutlined,
  WhatsAppOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  FileUnknownFilled,
} from "@ant-design/icons";
import { Tag } from "antd";
import { useMemo } from "react";

interface UTMSourcePropsI {
  utmSource: string;
}

export default function UTMSourceTag(props: UTMSourcePropsI) {
  const utmSource = useMemo(() => {
    switch (props.utmSource) {
      case "facebook":
        return (
          <Tag icon={<FacebookOutlined />} color="#3b5998">
            Facebook
          </Tag>
        );
      case "instagram":
        return (
          <Tag icon={<InstagramOutlined />} color="#E1306C">
            Instagram
          </Tag>
        );
      case "twitter":
        return (
          <Tag icon={<TwitterOutlined />} color="#1DA1F2">
            Twitter
          </Tag>
        );
      case "linkedin":
        return (
          <Tag icon={<LinkedinOutlined />} color="#0077b5">
            LinkedIn
          </Tag>
        );
      case "youtube":
        return (
          <Tag icon={<YoutubeOutlined />} color="#FF0000">
            YouTube
          </Tag>
        );
      case "google":
        return (
          <Tag icon={<GoogleOutlined />} color="#DB4437">
            Google
          </Tag>
        );
      case "email":
        return (
          <Tag icon={<MailOutlined />} color="orange">
            Email
          </Tag>
        );
      case "whatsapp":
        return (
          <Tag icon={<WhatsAppOutlined />} color="#25D366">
            WhatsApp
          </Tag>
        );
      case "sms":
        return (
          <Tag icon={<MessageOutlined />} color="gray">
            SMS
          </Tag>
        );
      case "telegram":
        return (
          <Tag icon={<MessageOutlined />} color="gray">
            Telegram
          </Tag>
        );

      case "google":
        return (
          <Tag icon={<GoogleOutlined />} color="blue">
            Google
          </Tag>
        );
      default:
        return (
          <Tag icon={<FileUnknownFilled />} color="purple">
            Other
          </Tag>
        );
    }
  }, [props.utmSource]);

  return utmSource;
}
