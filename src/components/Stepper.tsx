import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button, Space, Steps } from 'antd';
import React, { Fragment, useState } from 'react';

interface StepperPropsI {
  position?: string;
  nextCta?: (s: any, a: any) => React.ReactNode;
  submitCta?: (s: any, a: any) => React.ReactNode;
  alertMessage: React.ReactNode | string;
  prevCta?:(s: any, a: any)=>React.ReactNode;
    steps: {
      title?: string;
      validator?: () => boolean;
      content: React.ReactNode;
      data: any;
    }[]
}


const Stepper: React.FC<StepperPropsI> = (props) => {
    const steps = props.steps || [];
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
      marginTop: 20,
      minHeight:300
  };

  const StepperCta = <Space direction='horizontal' style={{ marginBottom: 24, justifyContent: 'space-between', width: '100%' }}>
{ props.prevCta?props.prevCta(steps[current]?.data,prev):(
      <Button style={{margin: '0 8px',visibility:(current > 0)?'visible':'hidden'}} icon={<ArrowLeftOutlined/>} onClick={() => prev()}>
        Previous
      </Button>
    )}
    {(
      <Fragment>
        {
          (current === steps.length - 1) ? (props.submitCta?props.submitCta(steps[current]?.data,next): <Button style={{ visibility: (current < steps.length - 1) ? 'visible' : 'visible' }} icon={<ArrowRightOutlined />} ghost type="primary" onClick={() => next()}>
        Finish
        </Button>): props.nextCta?props.nextCta(steps[current]?.data,next):(<Button style={{visibility:(current < steps.length - 1)?'visible':'hidden'}} icon={<ArrowRightOutlined/>}  ghost type="primary" onClick={() => next()}>
        Next
      </Button>)
        }
     </Fragment>
    )}
 
  </Space>;

  return (
    <>
     {props.position!=='bottom'?StepperCta:null}
      <Steps current={current} items={items} />
      {props.alertMessage?<div style={{marginTop: 20}}>{props.alertMessage}</div>:null}
      {steps.map((step,index) => {
        return <div style={{...contentStyle,display:index===current?'block':'none'}}>{step.content}</div>;
      })}
    {props.position==='bottom'?StepperCta:null}

    </>
  );
};

export default Stepper;