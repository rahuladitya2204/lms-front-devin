import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Space, Steps, message, theme } from 'antd';
import React, { useState } from 'react';

interface StepperPropsI {
    steps: {
        title: string;
      content: React.ReactNode;
      onNext?: Function;
      onPrev?: Function;
    }[]
}


const Stepper: React.FC<StepperPropsI> = (props = { steps: [] }) => {
    const steps = props.steps;
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  
  const onPrev = steps[current].onPrev;
  const onNext = steps[current].onNext;
  const isValid = onNext ? onNext() : true;
  console.log(isValid, 'valid');
  const next = () => {
    if (!isValid) {
      return;
    }
    setCurrent(current + 1);
  };

  const prev = () => {
    // const isValid = onPrev && onPrev();
    // if (!isValid) {
    //   return;
    // }
    setCurrent(current + 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    // lineHeight: '260px',
    // textAlign: 'center',
    // color: token.colorTextTertiary,
    // // backgroundColor: token.colorFillAlter,
    // borderRadius: token.borderRadiusLG,
    // border: `1px dashed ${token.colorBorder}`,
      marginTop: 20,
      minHeight:300
  };

  return (
    <>
      <Space direction='horizontal' style={{ marginBottom: 24, justifyContent: 'space-between', width: '100%' }}>
      { (
          <Button style={{margin: '0 8px',visibility:(current > 0)?'visible':'hidden'}} icon={<ArrowLeftOutlined/>} onClick={() => prev()}>
            Previous
          </Button>
        )}
      { (
          <Button disabled={!isValid} style={{visibility:(current < steps.length - 1)?'visible':'hidden'}} icon={<ArrowRightOutlined/>} type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
     
      </Space>
      <Steps current={current} items={items} />
      {steps.map((step,index) => {
        return <div style={{...contentStyle,display:index===current?'block':'none'}}>{step.content}</div>;
      })}
    </>
  );
};

export default Stepper;