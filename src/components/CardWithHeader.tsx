import { ArrowLeftOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Card, Col, Image, Row } from 'antd'
import { ReactNode } from 'react'

interface CourseBuilderScreenPropsI {
  rightButtons?: ReactNode;
  leftButtons?: ReactNode;
  children: ReactNode;
}

const CustomCard = styled(Card)`
.ant-card-extra {
    margin-left: 0;
    width: 100%;
}
`

function CardWithHeader(props: CourseBuilderScreenPropsI) {
  return (
    <CustomCard extra={[<span>{props.leftButtons}</span>, props.rightButtons]}>
      {props.children}
    </CustomCard>
  )
}

export default CardWithHeader
