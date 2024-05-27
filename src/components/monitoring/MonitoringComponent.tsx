import { Common, User } from "@adewaskar/lms-common";
import "./screenshot-effect.css";
import { Title } from "@Components/Typography/Typography";
import { CameraOutlined } from "@ant-design/icons";
import { Alert, message } from "antd";
import html2canvas from "html2canvas";
import { useEffect, useRef } from "react";

const TIME_BETWEEN_SCREENSHOTS_IN_MIN = 20;
const LAST_SCREENSHOT_TIME_KEY = "lastScreenshotTime";
const CHECK_AFTER_MIN = 5;
interface MonitoringComponentPropsI {
  children: React.ReactNode;
}

export default function MonitoringComponent(props: MonitoringComponentPropsI) {
  const { mutate: uploadFiles } = Common.Queries.useUploadFiles();
  const { mutate: takeScreenshot } = User.Queries.useUpdateUserScreenshot();
  const audioRef = useRef<any>(null);
  const screenshotRef = useRef<any>(null);

  useEffect(() => {
    audioRef.current = new Audio(`/screenshot-sound.mp3`);

    const captureScreenshotAsync = async () => {
      try {
        const currentTime = Date.now();
        const lastScreenshotTime = localStorage.getItem(
          LAST_SCREENSHOT_TIME_KEY
        );

        if (
          !lastScreenshotTime ||
          currentTime - parseInt(lastScreenshotTime) >=
            TIME_BETWEEN_SCREENSHOTS_IN_MIN * 60 * 1000
        ) {
          const file = await captureScreenshot(screenshotRef);
          audioRef.current.play();
          message.success("Screenshot Captured");

          uploadFiles(
            {
              files: [
                {
                  file,
                  prefixKey: "monitoring/screenshots",
                },
              ],
              onSuccess: () => {},
            },
            {
              onSuccess: (url: string) => {
                takeScreenshot({ url: url });
                localStorage.setItem(
                  LAST_SCREENSHOT_TIME_KEY,
                  currentTime.toString()
                );
              },
            }
          );
        }
      } catch (error) {
        // Handle any errors that occurred during the screenshot capture
        console.error("Screenshot capture error:", error);
      }
    };

    const checkScreenshotInterval = setInterval(() => {
      captureScreenshotAsync();
    }, CHECK_AFTER_MIN * 60 * 1000); // Check every minute

    return () => {
      clearInterval(checkScreenshotInterval);
    };
  }, []);

  return (
    <div ref={screenshotRef}>
      <Alert
        style={{ borderRadius: 0 }}
        message="You are being monitored"
        type="error"
        showIcon
        icon={<CameraOutlined />}
      />
      {props.children}
    </div>
  );
}

// ... (rest of the code remains the same)
