import HtmlViewer from '@Components/HtmlViewer'
import ProductDiscussion from '@Learner/Screens/ProductDiscussion'
import React from 'react'
import Tabs from '@Components/Tabs'
import { Types } from '@adewaskar/lms-common'
import { Typography } from 'antd'
import useQuestion from './hooks/useQuestion'
// import useWatchTime from '@Components/MediaPlayer/Playr/useWatchTime'

const { Text } = Typography
interface TestPlayerMoreInfoPropsI {
  test: Types.Test;
  itemId: string;
}

const TestPlayerMoreInfo: React.FC<TestPlayerMoreInfoPropsI> = props => {
  // useWatchTime(props.course._id);
  const { currentQuestion } = useQuestion()
  const TAB_ITEMS = [
    // {
    //   label: <Text strong>Overview</Text>,
    //   key: '2',
    //   children: <TestOverview hidePreview course={props.course} />
    // },
    {
      label: <Text strong>Solution</Text>,
      key: 'notes',
      children: <HtmlViewer content={currentQuestion.solution?.html + ''} />
    },
    {
      label: <Text strong> Discussion</Text>,
      key: 'discussion',
      children: (
        <ProductDiscussion
          itemId={props.itemId}
          product={{ type: 'test', id: props.test._id + '' }}
        />
      )
    }
    // {
    //   label: <Text strong>Announcements</Text>,
    //   key: '4',
    //   children: 'Tab 3'
    // },
    // {
    //   label: <Text strong>Reviews</Text>,
    //   key: '5',
    //   children: 'Tab 3'
    // },
    // {
    //   label: 'Learning Tools',
    //   key: '6',
    //   children: 'Tab 3'
    // }
  ]
  return <Tabs defaultActiveKey="1" items={TAB_ITEMS} />
}

export default TestPlayerMoreInfo
