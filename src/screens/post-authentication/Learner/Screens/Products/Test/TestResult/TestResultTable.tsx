// TestResult.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Learner } from '@adewaskar/lms-common';
import { Card, Table, Tag, Typography } from 'antd';
import Header from '@Components/Header';
import HtmlViewer from '@Components/HtmlViewer';

const { Text,Title } = Typography;

interface TestResultItem {
  questionIndex: number;
  title: string;
  isCorrect: boolean;
  timeSpent: number;
}

const TestResultTable: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { data: {test:testResult}, isLoading } = Learner.Queries.useGetTestResult(testId || '');

  const processedData: TestResultItem[] | undefined = testResult?.sections?.map((section, sectionIndex) => {
    return section.items.map((item, itemIndex) => {
      return {
          questionIndex: itemIndex + 1,
          key: item._id,
            title: item.title,
            isCorrect: item.isCorrect,
                  // @ts-ignore
                  scoreAchieved: item.scoreAchieved,
                   // @ts-ignore
                   solutionHtml: item?.solution?.html,
              // @ts-ignore
              timeSpent: item.timeSpent,
      };
    });
  }).flat();

  return (
    <Card bodyStyle={{minHeight:600}} hoverable title={testResult.title} >
    <Table bordered pagination={false}
        dataSource={processedData}
        loading={isLoading}   expandable={{
            expandedRowRender: (record) => <>
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
      <span>{title.length > 20 ? `${title.substring(0, 20)}...` : <HtmlViewer content={title}></HtmlViewer> }</span>
  )}
/>
<Table.Column
  title="Result"
  dataIndex="isCorrect"
  key="isCorrect"
  render={isCorrect => (
    <Tag color={isCorrect ? 'green' : 'red'}>{isCorrect ? 'Correct' : 'Incorrect'}</Tag>
  )}
/>
<Table.Column
  title="Time Spent (s)"
  dataIndex="timeSpent"
  key="timeSpent"
  render={timeSpent => <span>{ Math.ceil(timeSpent/60)} mins</span>}
        />
             <Table.Column
  title="Score"
  dataIndex="scoreAchieved"
  key="scoreAchieved"
  render={scoreAchieved => <span>{scoreAchieved} </span>}
/>
</Table>
  </Card>
  );
};

export default TestResultTable;
