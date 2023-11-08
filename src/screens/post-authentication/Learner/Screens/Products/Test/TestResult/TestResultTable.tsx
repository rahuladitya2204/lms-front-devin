import { Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { Learner, Types, Utils } from '@adewaskar/lms-common';

import { GlobalOutlined } from '@ant-design/icons';
import Header from '@Components/Header';
import HtmlViewer from '@Components/HtmlViewer';
// TestResult.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const { Text,Title } = Typography;

interface TestResultItem {
  questionIndex: number;
  title: string;
  isCorrect: boolean;
  timeSpent: number;
  globalCorrectPercentage: number;
}

const TestResultTable: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { data: { test: testResult }, isFetching } = Learner.Queries.useGetTestResult(testId || '');

    // @ts-ignore
  const processedData: TestResultItem[] = testResult?.sections?.map((section, sectionIndex) => {
    return section.items.map((item, itemIndex) => {
      return {
          questionIndex: itemIndex + 1,
          key: item._id,
            title: item.title,
        isCorrect: item.isCorrect,
  optionsSelected: item.optionsSelected || [],
            isAnswered: item.isAnswered,
                  scoreAchieved: item.scoreAchieved,
                   solutionHtml: item?.solution?.html,
        timeSpent: item.timeSpent,
        globalCorrectPercentage: item.globalCorrectPercentage
      };
    });
  }).flat();

  return (
    <Table bordered pagination={false}
    dataSource={processedData}
    loading={isFetching}   expandable={{
      expandedRowRender: (record) => <>
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
        title="Option Selected"
        dataIndex="optionsSelected"
        key="optionsSelected"
               /* @ts-ignore */
        render={(_, record: TestResultItem) => record.optionsSelected.map(opt => <Tag>{opt }</Tag>) }
/>
<Table.Column
title="Result"
dataIndex="isCorrect"
key="isCorrect"
render={(_,record:TestResultItem) => (
  <Space>
       {/* @ts-ignore */}
 <Tag color={record.isCorrect ? 'green' : (record.isAnswered ? 'red' : 'orange')}>
    {/* @ts-ignore */}
    {record.isCorrect ? 'Correct' : (record.isAnswered ? 'Incorrect' : 'Not Attempted')}</Tag>
  <Tooltip placement="right" title={`${Math.ceil(record.globalCorrectPercentage)}%`}>
  <GlobalOutlined/>
        </Tooltip>
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
