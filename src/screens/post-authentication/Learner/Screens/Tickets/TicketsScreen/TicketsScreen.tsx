import { Button, Card, Empty, Space } from 'antd'

import ActionModal from '@Components/ActionModal'
import CreateTicket from '../CreateTicket'
import { Learner } from '@adewaskar/lms-common'
import { Link } from 'react-router-dom'
import TicketItem from './TicketItem'

export default function TicketsScreen () {
  const { data: tickets } = Learner.Queries.useGetTickets()

    return tickets.length? <>
        <Space size={[20,30]} style={{width:'100%'}} direction='vertical'>
            {tickets.map(ticket => {
              return <Link to={ticket._id+''}>
              <TicketItem ticket={ticket} /></Link>;
    })}
      </Space></> : <Card>
      <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    imageStyle={{ height: 60 }}
    description={
      <span>
        No Tickets Found
      </span>
    }
  >
        <ActionModal cta={<Button type="primary">Create Now</Button>}>
          <CreateTicket/>
    </ActionModal>
  </Empty>
        </Card>
}
