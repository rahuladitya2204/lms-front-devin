import { Card, Typography } from 'antd'

import { ReactNode } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  /* display: flex; */
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 100px;
  width: 100%;
`

interface AuthenticationCardPropsI {
  children?: ReactNode;
  title?: string | ReactNode;
}

function AuthenticationCard(props: AuthenticationCardPropsI) {
  return (
    <Container>
      <Card
        title={
          <Typography.Title style={{ textAlign: 'center' }} level={3}>
            {props.title}
          </Typography.Title>
        }
        style={{ width: 350, minHeight: 500 }}
      >
        {props.children}
      </Card>
    </Container>
  )
}

export default AuthenticationCard
