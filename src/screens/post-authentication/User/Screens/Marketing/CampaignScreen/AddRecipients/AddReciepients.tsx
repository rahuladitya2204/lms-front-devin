import { Form, Input, Radio, Tag } from "antd";

import QuillEditor from "@Components/QuillEditor";
import RuleCreator from "./RuleCreator/RuleCreator";
import { Types } from "@adewaskar/lms-common";

interface AddRecipientsPropsI {
    form: any;
  data: any;
  operator: string;
  setOperator: (s: string) => void;
    addRule: Function;
    updateRule: Function;
    deleteRule: Function;
    rules: Types.Rule[];
}

const AddRecipients = ({form,setOperator,operator,updateRule,deleteRule,rules,addRule}:AddRecipientsPropsI) => {
    const recipientsType = Form.useWatch(['recipients', 'type'], form);
  
    return <>
    <Form.Item name={['recipients','type']}>
     <Radio.Group>
       <Radio value="entire">Entire Audience</Radio>
       <Radio value="segment">Segment</Radio>
       <Radio value="email-list">Email List</Radio>
     </Radio.Group>
   </Form.Item>
   {recipientsType==='email-list'?<Form.Item name={['recipients','emailList']}
     label="Email List" required>
       <Input placeholder="Enter receipients for the campaign" />
   </Form.Item> : null}
   {recipientsType === 'segment' ? <RuleCreator operator={operator} setOperator={setOperator} updateRule={updateRule} addRule={addRule} deleteRule={deleteRule} rules={rules} />:null}
 </>
}

export default AddRecipients;