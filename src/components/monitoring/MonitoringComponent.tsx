import { Common, Store, User } from "@adewaskar/lms-common";
import "./screenshot-effect.css";
import { Text, Title } from "@Components/Typography/Typography";
import { CameraOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Tag, message } from "antd";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@Components/ActionModal/ModalContext";
import TextArea from "@Components/Textarea";
import AppImage from "@Components/Image";
import { useIdleTimer } from "react-idle-timer";
import { LiveTimer } from "./LiveTimer";
import ProtectedContent from "@Components/ProtectedComponent";
import { v4 as uuidv4 } from 'uuid'; // For generating unique tab IDs

const IDLE_TIMEOUT_IN_MINS = 10;
const TIME_BETWEEN_SCREENSHOTS_IN_MIN = 60;
const CLOSE_WITHOUT_INPUT_IN_MIN = 1;
const LAST_SCREENSHOT_TIME_KEY = "lastScreenshotTime";
const LAST_ADD_TIME_KEY = "lastAddTime"; // Key to store last addTime sent
const CHECK_AFTER_MIN = 5;
const ADD_TIME = 15; // Time in minutes to add to user log
const ADD_TIME_LEADER_KEY = "addTimeLeader"; // Key to store leader tab ID
const IS_LOCAL_STORAGE_AVAILABLE = typeof window !== 'undefined' && window.localStorage;

interface MonitoringComponentPropsI {
  children: React.ReactNode;
}

export default function MonitoringComponent(props: MonitoringComponentPropsI) {
  const audioRef = useRef<any>(null);
  const tabId = useRef<string>(uuidv4()); // Unique ID for this tab
  const [state, setState] = useState<string>("active");
  const [idleStartTime, setIdleStartTime] = useState<number | null>(null);
  const idleAccumulatedTimeRef = useRef<number>(0); // To accumulate idle time
  const addTimeTimeoutRef = useRef<number | null>(null);
  const isLeaderRef = useRef<boolean>(false); // To track if this tab is the leader
  const { mutate: updateUserLog } = User.Queries.useUpdateUserLog();

  const onIdle = () => {
    setState("idle");
    setIdleStartTime(Date.now() - IDLE_TIMEOUT_IN_MINS * 60 * 1000);
    if (addTimeTimeoutRef.current !== null) {
      clearTimeout(addTimeTimeoutRef.current);
      addTimeTimeoutRef.current = null;
    }
    // Start accumulating idle time
    idleAccumulatedTimeRef.current = IDLE_TIMEOUT_IN_MINS;
  };

  const onActive = () => {
    setState("active");
    // Calculate total idle time
    if (idleStartTime) {
      const now = Date.now();
      const totalIdleTimeMins = Math.floor((now - idleStartTime) / (60 * 1000));
      idleAccumulatedTimeRef.current += totalIdleTimeMins;
      // Update user log with total idle time
      updateUserLog({ idleTime: idleAccumulatedTimeRef.current });
      idleAccumulatedTimeRef.current = 0;
    }
    setIdleStartTime(null);
    if (addTimeTimeoutRef.current === null && isLeaderRef.current) {
      startAddTimeTimeout();
    }
  };

  const { start, pause } = useIdleTimer({
    startManually: true,
    timeout: IDLE_TIMEOUT_IN_MINS * 60 * 1000,
    onIdle,
    onActive,
    events: ["mousemove", "keydown", "mousedown", "touchstart"],
    debounce: 2000,
  });

  const sendAddTime = () => {
    updateUserLog(
      { addTime: ADD_TIME },
      {
        onSuccess: () => {
          if (IS_LOCAL_STORAGE_AVAILABLE) {
            localStorage.setItem(LAST_ADD_TIME_KEY, Date.now().toString());
          }
        },
        onError: (error) => {
          console.error('Failed to send addTime:', error);
        },
      }
    );
  };

  const startAddTimeTimeout = () => {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;
    const lastAddTime = localStorage.getItem(LAST_ADD_TIME_KEY);
    const now = Date.now();
    let initialDelay = ADD_TIME * 60 * 1000;

    let lastAddTimeMs = parseInt(lastAddTime || '', 10);
    if (isNaN(lastAddTimeMs) || lastAddTimeMs > now) {
      lastAddTimeMs = now;
      localStorage.setItem(LAST_ADD_TIME_KEY, lastAddTimeMs.toString());
    }

    let elapsedTime = now - lastAddTimeMs;
    if (elapsedTime >= ADD_TIME * 60 * 1000) {
      sendAddTime();
      initialDelay = ADD_TIME * 60 * 1000;
    } else {
      initialDelay = ADD_TIME * 60 * 1000 - elapsedTime;
    }

    addTimeTimeoutRef.current = window.setTimeout(function timeoutFunc() {
      sendAddTime();
      addTimeTimeoutRef.current = window.setTimeout(
        timeoutFunc,
        ADD_TIME * 60 * 1000
      );
    }, initialDelay);
  };

  const becomeLeader = () => {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;
    localStorage.setItem(ADD_TIME_LEADER_KEY, tabId.current);
    isLeaderRef.current = true;
    if (state === "active" && addTimeTimeoutRef.current === null) {
      startAddTimeTimeout();
    }
  };

  const checkLeader = () => {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;
    const leaderId = localStorage.getItem(ADD_TIME_LEADER_KEY);
    if (!leaderId || leaderId === tabId.current) {
      becomeLeader();
    } else {
      isLeaderRef.current = false;
    }
  };

  useEffect(() => {
    if (!IS_LOCAL_STORAGE_AVAILABLE) return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ADD_TIME_LEADER_KEY) {
        const leaderId = event.newValue;
        if (leaderId === tabId.current) {
          isLeaderRef.current = true;
          if (state === "active" && addTimeTimeoutRef.current === null) {
            startAddTimeTimeout();
          }
        } else {
          isLeaderRef.current = false;
          if (addTimeTimeoutRef.current !== null) {
            clearTimeout(addTimeTimeoutRef.current);
            addTimeTimeoutRef.current = null;
          }
        }
      }
    };

    window.addEventListener('storage', handleStorage);

    // Attempt to become leader on mount
    checkLeader();

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (isLeaderRef.current && localStorage.getItem(ADD_TIME_LEADER_KEY) === tabId.current) {
        localStorage.removeItem(ADD_TIME_LEADER_KEY);
      }
      if (addTimeTimeoutRef.current !== null) {
        clearTimeout(addTimeTimeoutRef.current);
        addTimeTimeoutRef.current = null;
      }
    };
  }, [state]);

  useEffect(() => {
    if (isSignedIn) {
      start();
    } else {
      pause();
      if (addTimeTimeoutRef.current !== null) {
        clearTimeout(addTimeTimeoutRef.current);
        addTimeTimeoutRef.current = null;
      }
    }
  }, [isSignedIn]);

  const screenshotRef = useRef<any>(null);
  const { isSignedIn } = Store.useAuthentication((s) => s);
  const { data: user } = User.Queries.useGetUserDetails();
  const { data: userLog } = User.Queries.useGetUserLog(user?._id || "", "");
  const { openModal } = useModal();

  useEffect(() => {
    if (isSignedIn && user?.monitoring?.enabled) {
      audioRef.current = new Audio(`/screenshot-sound.mp3`);

      const captureScreenshotAsync = async () => {
        try {
          const currentTime = Date.now();
          const lastScreenshotTime = IS_LOCAL_STORAGE_AVAILABLE
            ? localStorage.getItem(LAST_SCREENSHOT_TIME_KEY)
            : null;

          let lastScreenshotTimeMs = parseInt(lastScreenshotTime || '', 10);
          if (isNaN(lastScreenshotTimeMs)) {
            lastScreenshotTimeMs = 0;
          }

          if (
            !lastScreenshotTimeMs ||
            currentTime - lastScreenshotTimeMs >=
            TIME_BETWEEN_SCREENSHOTS_IN_MIN * 60 * 1000
          ) {
            if (state === "idle") {
              return;
            }
            const { file, url } = await captureScreenshot(screenshotRef);
            audioRef.current.play();
            message.success("Screenshot Captured");
            openModal(
              <ScreenshotForm
                file={file}
                currentTime={currentTime}
                image={url}
              />
            );
          }
        } catch (error) {
          console.error("Screenshot capture error:", error);
        }
      };

      const checkScreenshotInterval = setInterval(() => {
        captureScreenshotAsync();
      }, CHECK_AFTER_MIN * 60 * 1000);

      const lastScreenshotTime = IS_LOCAL_STORAGE_AVAILABLE
        ? localStorage.getItem(LAST_SCREENSHOT_TIME_KEY)
        : null;
      if (!lastScreenshotTime) {
        captureScreenshotAsync();
      }

      return () => {
        clearInterval(checkScreenshotInterval);
      };
    }
  }, [isSignedIn, state, user]);

  const calculateTotalIdleTime = () => {
    if (!idleStartTime) return IDLE_TIMEOUT_IN_MINS;
    const now = Date.now();
    const idleDurationMs = now - idleStartTime;
    const idleDurationMins = Math.floor(idleDurationMs / (60 * 1000));
    return idleDurationMins;
  };

  return (
    <ProtectedContent
      cta={
        <Alert
          type="error"
          message={
            <Title>
              System Idle for {calculateTotalIdleTime()} minutes
            </Title>
          }
        />
      }
      isVerified={state === "active"}
    >
      <div ref={screenshotRef}>
        <Alert
          style={{ borderRadius: 0 }}
          message={<Text strong>You are being monitored</Text>}
          type="error"
          showIcon
          icon={<CameraOutlined />}
          action={
            userLog?.startedAt ? (
              <div style={{ width: 160 }}>
                Time Logged{" "}
                <Tag color="blue">
                  <LiveTimer startedAt={userLog.startedAt} />
                </Tag>
              </div>
            ) : null
          }
        />
        {props.children}
      </div>
    </ProtectedContent>
  );
}

// Rest of the code remains unchanged (captureScreenshot, dataURLToBlob, ScreenshotForm)
