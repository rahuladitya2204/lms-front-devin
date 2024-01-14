import React, { ChangeEvent, useRef, useState } from 'react';

import { Button } from 'antd';

interface EmailListUploaderProps {
  onChange: (emailList: string[]) => void;
}

const EmailListUploader: React.FC<EmailListUploaderProps> = ({ onChange }) => {
    const ref = useRef(null);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result as string;
      const lines = text.split(/\r\n|\n/);
      const emailList = lines.map(line => line.split(',')).flat().map(e => e.trim()).filter(Boolean);
      onChange(emailList);
    };
    reader.readAsText(file);
  };

  return (
      <>
          {/* @ts-ignore */}
          <Button size='small' type='primary' style={{marginBottom:10}} onClick={()=>ref.current.click()}>Upload CSV</Button>
          {/* @ts-ignore */}
          <input type="file" ref={ref} accept=".csv" style={{display:'none'}} onChange={handleFileChange} />
      </>
  );
};

export default EmailListUploader;
