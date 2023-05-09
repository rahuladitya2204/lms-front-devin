import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Card, Checkbox, Typography } from 'antd';
import {
  CameraSelection,
  QualitySelection,
  PreviewVideo,
} from 'amazon-chime-sdk-component-library-react';
import { User } from '@adewaskar/lms-common';
import { useNavigate } from 'react-router';
import UserLiveSessionPlayer from './LiveSessionPlayer';
import { useLiveSession } from './hooks';
import { VideoCameraOutlined } from '@ant-design/icons';

const { Text } = Typography;

const UserDeviceSelection = () => {
  const [joined, setJoined] = useState(false);
  const { sessionId } = useParams();
  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const navigate = useNavigate();

  const { joinMeeting } = useLiveSession(sessionId + '');

  const {
    mutate: startSession, isLoading: startinSession
  } = User.Queries.useStartLiveSession()

  const {
    mutate: endMeeting,
    isLoading: endingSession
  } = User.Queries.useEndMeeting()

  
  useEffect(() => {
    if(session?.metadata?.MeetingId){
      joinMeeting(session)
    }
  },[session])

  const handleJoinMeeting = () => {
    // setJoined(true);
    navigate(`${session.metadata.MeetingId}/session`);
  }
  const [recordMeeting, setRecordMeeting] = useState(false);
  return (
    <>
      <Card style={{
        width: 300,
        margin: 'auto',
        marginTop:170
      }}>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        <Checkbox onChange={e=>setRecordMeeting(e.target.checked)} value={recordMeeting}> <VideoCameraOutlined/>  Record Meeting</Checkbox>
        {(session?.metadata?.MeetingId)?<Button loading={endingSession} style={{margin: '10px 0'}} onClick={()=>endMeeting({session:sessionId+''})} block>
          End Meeting
        </Button>:<Button loading={startinSession} style={{margin: '10px 0'}} onClick={()=>startSession({session:sessionId+'',enableRecording: recordMeeting})} block>
          Start Meeting
        </Button>}
        <Button style={{margin: '10px 0'}} type="primary" onClick={handleJoinMeeting} block>
          Join Meeting
        </Button>
      </Card>      
    </>
  );
};

export default UserDeviceSelection;
