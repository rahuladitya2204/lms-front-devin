import { Button, Card, Col, Row, Space, Table } from 'antd'

import Container from '@Components/Container'
import Header from '@User/Screens/UserRoot/UserHeader'

import { User } from '@adewaskar/lms-common'
import dayjs from 'dayjs'
import { useModal } from '@Components/ActionModal/ModalContext'
import AddText from './AddText'
import TextsTable from './TextsTable'

function TextsScreen() {
    const { openModal } = useModal()
    return (
        <Header
            title={'Texts'}
            extra={[
                <Button
                    onClick={() => {
                        openModal(<AddText> </AddText>)
                    }}
                    type="primary"
                >
                    Add Text
                </Button>
            ]}
        >
            <Container>
                <Row>
                    <Col span={24}>
                        <TextsTable />
                    </Col>
                </Row>
            </Container>
        </Header>
    )
}

export default TextsScreen
