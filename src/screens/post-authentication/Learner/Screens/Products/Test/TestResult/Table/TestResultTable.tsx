import { Alert, Card, Col, Row, Space, Table, Tag, Tooltip } from 'antd';
import { Enum, Learner, Types, Utils } from '@adewaskar/lms-common';
import React, { useState } from 'react';

import { GlobalOutlined } from '@ant-design/icons';
import HtmlViewer from '@Components/HtmlViewer/HtmlViewer';
import { Typography } from '@Components/Typography';
import { useParams } from 'react-router-dom';

const { Text,Title } = Typography;

interface TestResultItem extends Types.TestStatusQuestionStats {
  questionIndex: number;
  title: {text:Types.LangText};
  isCorrect: boolean;
  timeSpent: number;
  globalCorrectPercentage: number;
  isAnswered: boolean;
}

const TestResultTable: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const onExpand = (expanded: boolean, record: Types.TestStatusQuestionStats) => {
    const keys = expanded ? [record._id + ''] : [];
    console.log(expanded,keys, 'rrrr');
    setExpandedRowKeys(keys);
  };
  const { data: { test: testResult }, isFetching } = Learner.Queries.useGetTestResult(testId || '');
  return (
    <Row gutter={[20,30]}>
      
      {testResult.sections.map(section => {
      return  <Col span={24}><Card title={section.title}>
      <Table bordered pagination={false}
    dataSource={section.items}
          loading={isFetching}
          expandable={{
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
        <HtmlViewer content={record.title+''} />
        
       {record.subjectiveAnswerGiven?<> <Title level={4}>Your answer</Title>
        <HtmlViewer content={record.subjectiveAnswerGiven} /></>:null}
            <Title level={4}>Solution</Title>
            <div>
            {/*  @ts-ignore */}
  <HtmlViewer content={record.solution.html} />
            </div>
        </>,
    }}>
<Table.Column title="Question No." dataIndex="questionIndex" key="questionIndex"   render={(q,d,index) => (
    //  @ts-ignore
        <Text>Question {index + 1}</Text>
)} />
        <Table.Column
        title="Question Type"
        dataIndex="type"
        key="type"
        render={(_, record: TestResultItem) =>record.type==='subjective'? <Tag color='blue-inverse'>Subjective</Tag>: <Tag color='orange-inverse'>{record?.type?.toUpperCase() } CHOICE</Tag>}
/>
      <Table.Column
        title="Option Selected"
        dataIndex="optionsSelected"
        key="optionsSelected"
        render={(_, record: TestResultItem) => record.type!=='subjective'?((record?.optionsSelected?.length)?(record?.optionsSelected?.map(opt => <Tag>{opt }</Tag>)):'-') :'-'}
/>
<Table.Column
title="Result"
dataIndex="isCorrect"
key="isCorrect"
render={(_,record:TestResultItem) => (
  <TestAnswerTag item={record} />
)}
/>
<Table.Column
title="Time Spent (s)"
dataIndex="timeSpent"
key="timeSpent"
render={timeSpent => <span>{timeSpent?Utils.formatTime(timeSpent):'-'}</span>}
    />
         <Table.Column
title="Score"
dataIndex="scoreAchieved"
key="scoreAchieved"
render={scoreAchieved => <span>{scoreAchieved>=0?scoreAchieved:'-'} </span>}
/>
</Table>
    </Card></Col>
    })}

    </Row>
  );
};

export default TestResultTable;


export const TestAnswerTag = ({ item }: { item: Types.TestStatusQuestionStats }) => {
  return   <Space>
  {/* @ts-ignore */}
{item.type === 'subjective' ? <>
     {/* @ts-ignore */}
{item.notEvaluated?<Tag color='orange-inverse'>Not evaluated</Tag>:(item.isAnswered?<Tag>Attempted</Tag>:<Tag>Not Attempted</Tag>)}
</> : <>
     {/* @ts-ignore */}
     {item.isAnswered ? <>
   {item.isCorrect?<Tag color='green-inverse'>Correct</Tag>:<Tag color='red-inverse'>Incorrect</Tag>}
   </> : <Tag color='orange-inverse'>Not Attempted</Tag>}
   {/* <Tooltip placement="right" title={`Global Correctness: ${Math.ceil(item.globalCorrectPercentage)}%`}>  <GlobalOutlined/>
   </Tooltip> */}
</>}
  {/* @ts-ignore */}

</Space>
}