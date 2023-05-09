import { Button, Card, Checkbox, Result, Typography } from 'antd';
import {
  CameraSelection,
  PreviewVideo,
  QualitySelection,
} from 'amazon-chime-sdk-component-library-react';
import React, { useEffect, useState } from 'react';
import { SmileOutlined, VideoCameraOutlined } from '@ant-design/icons';

import { User } from '@adewaskar/lms-common';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';

const { Text } = Typography;

const UserDeviceSelection = () => {
  const { sessionId } = useParams();
  const { data: session } = User.Queries.useGetLiveSessionDetails(
    sessionId + ''
  )
  const navigate = useNavigate();
  const {
    mutate: startSession, isLoading: startinSession
  } = User.Queries.useStartLiveSession()

  const {
    mutate: endMeeting,
    isLoading: endingSession
  } = User.Queries.useEndMeeting()

  const startMeeting = () => { 
    startSession({ session: sessionId + '', enableRecording: recordMeeting }, {
      onSuccess: (session) => {
        navigate(`${session.metadata.MeetingId}/session`)
      }
    })
  }
  
  const [recordMeeting, setRecordMeeting] = useState(false);
  return (
    <>
      
      {session.startedAt&&session.endedAt? <Result
    icon={<SmileOutlined />}
    title="Meeting has ended"
        extra={<Button type="primary" onClick={() => {
      navigate('../app/live-session')
    }}>ok</Button>}
  />: <Card style={{
        width: 300,
        margin: 'auto',
        marginTop:170
      }}>
        <CameraSelection />
        <QualitySelection />
        <span style={{ display: 'block', marginBottom: '.5rem' }}>Video preview</span>
        <PreviewVideo />
        <Checkbox onChange={e => setRecordMeeting(e.target.checked)} value={recordMeeting}> <VideoCameraOutlined />  Record Meeting</Checkbox>
        {session.startedAt&&!session.endedAt?   <Button style={{margin: '10px 0'}} type="primary" onClick={()=>navigate(`${session.metadata.MeetingId}/session`)} block>
          Join Meeting
        </Button>:null}
        {(session.startedAt&&!session.endedAt)?<Button loading={endingSession} style={{margin: '10px 0'}} onClick={()=>endMeeting({session:sessionId+''})} block>
          End Meeting
        </Button> :null}
        {(!session.startedAt&&!session.endedAt)?<Button loading={startinSession} type='primary' style={{margin: '10px 0'}} onClick={startMeeting} block>
          Start Meeting
        </Button> : null}
        
     
      </Card> }

    </>
  );
};

export default UserDeviceSelection;
