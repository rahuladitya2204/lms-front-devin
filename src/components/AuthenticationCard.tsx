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
    // <Container>
    <div
      // title={null}
      style={{ minHeight: 500 }}
    >
      {props.children}
    </div>
    // </Container>
  )
}

export default AuthenticationCard
