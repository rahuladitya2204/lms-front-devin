import { Alert, Card, Col, Row, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { Learner, Types, Utils } from '@adewaskar/lms-common';

import { GlobalOutlined } from '@ant-design/icons';
import Header from '@Components/Header';
import HtmlViewer from '@Components/HtmlViewer';
// TestResult.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const { Text,Title } = Typography;

interface TestResultItem extends Types.TestStatusQuestionStats {
  questionIndex: number;
  title: string;
  isCorrect: boolean;
  timeSpent: number;
  globalCorrectPercentage: number;
  isAnswered: boolean;
}

const TestResultTable: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { data: { test: testResult }, isFetching } = Learner.Queries.useGetTestResult(testId || '');

    // @ts-ignore
  const processedData: TestResultItem[] = testResult?.sections?.map((section, sectionIndex) => {
    return section.items.map((item, itemIndex) => {
      return item
    });
  }).flat();

  return (
    <Table bordered pagination={false}
    dataSource={processedData}
    loading={isFetching}   expandable={{
      expandedRowRender: (record) => <>
        <Row gutter={[20,20]}>
          <Col span={24}>
{(record?.feedback?.met)?<Alert type='success' message='What was good' description={record.feedback.met} />:null}

          </Col>
          <Col span={24}>
{(record?.feedback?.notMet)?<Alert type='error' message='What could be improved' description={record.feedback.notMet} />:null}

          </Col>
</Row>
        <Title level={4}>Question</Title>
<HtmlViewer content={record.title} />
            <Title level={4}>Solution</Title>
            <div>
            {/*  @ts-ignore */}
  <HtmlViewer content={record.solutionHtml} />
            </div>
        </>,
    }}>
<Table.Column title="Question No." dataIndex="questionIndex" key="questionIndex"   render={questionIndex => (
        <Text>Question {questionIndex}</Text>
)} />
<Table.Column
title="Title"
dataIndex="title"
key="title"
render={title => (
  <span>{title.length > 20 ? <HtmlViewer content={`${title.substring(0, 20)}...`}></HtmlViewer> : <HtmlViewer content={title}></HtmlViewer> }</span>
)}
      />
        <Table.Column
        title="Question Type"
        dataIndex="type"
        key="type"
               /* @ts-ignore */
        render={(_, record: TestResultItem) =>record.type==='subjective'? <Tag color='blue-inverse'>Subjective</Tag>: <Tag color='orange-inverse'>{record?.type?.toUpperCase() }</Tag>}
/>
      <Table.Column
        title="Option Selected"
        dataIndex="optionsSelected"
        key="optionsSelected"
               /* @ts-ignore */
        render={(_, record: TestResultItem) => record.type!=='subjective'?record.optionsSelected.map(opt => <Tag>{opt }</Tag>) :'-'}
/>
<Table.Column
title="Result"
dataIndex="isCorrect"
key="isCorrect"
render={(_,record:TestResultItem) => (
  <Space>
       {/* @ts-ignore */}
    {record.type === 'subjective' ? <>
          {/* @ts-ignore */}
 {record.isAnswered?<Tag>Attempted</Tag>:<Tag>Not Attempted</Tag>}
    </> : <>
          {/* @ts-ignore */}
          {record.isAnswered ? <>
        {record.isCorrect?<Tag color='green-inverse'>Correct</Tag>:<Tag color='red-inverse'>Incorrect</Tag>}
        </> : <Tag color='orange-inverse'>Not Attempted</Tag>}
        <Tooltip placement="right" title={`${Math.ceil(record.globalCorrectPercentage)}%`}>  <GlobalOutlined/>
        </Tooltip>
    </>}
       {/* @ts-ignore */}

</Space>
)}
/>
<Table.Column
title="Time Spent (s)"
dataIndex="timeSpent"
key="timeSpent"
render={timeSpent => <span>{Utils.formatTime(timeSpent)}</span>}
    />
         <Table.Column
title="Score"
dataIndex="scoreAchieved"
key="scoreAchieved"
render={scoreAchieved => <span>{scoreAchieved} </span>}
/>
</Table>
  );
};

export default TestResultTable;
