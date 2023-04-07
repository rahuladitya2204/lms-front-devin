import { Button, Space, Steps, message, theme } from 'antd';
import React, { useState } from 'react';

interface StepperPropsI {
    steps: {
        title: string;
        content:React.ReactNode
    }[]
}


const Stepper: React.FC<StepperPropsI> = (props = { steps: [] }) => {
    const steps = props.steps;
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(1);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
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
      <Steps current={current} items={items} />
      {steps.map((step,index) => {
        return <div style={{...contentStyle,display:index===current?'block':'none'}}>{step.content}</div>;
      })}
      <Space direction='horizontal' style={{ marginTop: 24 }}>
      {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
      </Space>
    </>
  );
};

export default Stepper;