import "./style.css";

import { StyledContent, StyledLayout } from "./Player/styled";
import {
  UserActivityProvider,
  VideoTileGrid,
} from "amazon-chime-sdk-component-library-react";
import { useEvent, useHandleMeetingEnd } from "./hooks";

import { Learner } from "@adewaskar/lms-common";
import MeetingControls from "./Player/MeetingControls";
import NavigationControl from "./Player/Navigation/NavigationControl";
import { NavigationProvider } from "./Player/Navigation/NavigationProvider";
import { useEffect } from "react";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { useParams } from "@Router/index";

let joined = false;
const EventPlayer = () => {
  const { eventId } = useParams();
  const { data: session } = Learner.Queries.useGetEventDetails(eventId + "");
  const { joinMeeting, start } = useEvent(eventId + "");

  const { data: attendee } = Learner.Queries.useGetEventAttendeeDetails(
    eventId + "",
    {
      enabled: !!session?.metadata?.MeetingId,
    }
  );

  useHandleMeetingEnd();
  useEffect(() => {
    if (session._id) {
      if (attendee?.metadata?.AttendeeId) {
        // displayRecordingAlert()
        start(session, attendee);
      } else {
        if (!joined) {
          console.log("joining", joined);
          joined = true;
          joinMeeting(session).then((attendee: any) => {
            // displayRecordingAlert()
            start(session, attendee);
          });
        }
      }
    }
  }, [attendee]);

  const meetingManager = useMeetingManager();

  useEffect(() => {
    // This function is returned by the useEffect hook and will be run when the component is unmounted.
    return () => {
      if (meetingManager.audioVideo) {
        meetingManager.audioVideo.stopLocalVideoTile();
      }
    };
  }, [meetingManager]); // Depe

  return (
    <NavigationProvider>
      {/* @ts-ignore */}
      <UserActivityProvider>
        <StyledLayout showNav showRoster>
          <StyledContent>
            {/* <MeetingMetrics /> */}
            <VideoTileGrid
              className="videos"
              // noRemoteVideoView={<MeetingDetails />}
            />
            {/* <LocalVideo /> */}

            <MeetingControls />
          </StyledContent>
          <NavigationControl />
        </StyledLayout>
      </UserActivityProvider>
    </NavigationProvider>
  );
};

export default EventPlayer;
