import { Col, Row, Space, Tag, Typography } from "antd";
import { Types, Utils } from "@adewaskar/lms-common";

const {Text } = Typography;

interface PriceCardContentT {
    plan: Types.Plan
}

export default function PriceCardContent({plan}: PriceCardContentT) {
    const isPriceSame = ((plan?.displayPrice?.value) === (plan?.finalPrice?.value));
    return <Row justify={'space-between'} align={'middle'} >
        <Col>
        {((plan?.finalPrice?.value)!==0)?<>
                <Row>
                    <Col span={24}>
                    {!isPriceSame?<Text style={{ textAlign: 'right', textDecoration: 'line-through' }} type='secondary'>
        {Utils.UnitTypeToStr(plan.displayPrice)}</Text>:null}
                    </Col>
                    <Col span={24}>
                    <Text strong style={{fontSize: 18}}>
      {Utils.UnitTypeToStr(plan.finalPrice)}
                </Text>
                    </Col>
   </Row>
    
            </> :
      <Text style={{ fontSize: 16 }}>
      Free
                </Text>}
        </Col>
        <Col>
        {(plan.type!=='free' && !isPriceSame) ?<Col>
          <Tag color="purple" style={{marginRight:0}} >{ Math.floor(Number(plan.discount))}% off</Tag>
        </Col>:null}</Col>
    </Row>
}