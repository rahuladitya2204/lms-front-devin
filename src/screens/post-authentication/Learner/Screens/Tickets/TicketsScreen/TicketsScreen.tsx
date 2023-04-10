import { Learner } from '@adewaskar/lms-common'
import { Link } from 'react-router-dom'
import { Space } from 'antd'
import TicketItem from './TicketItem'

export default function TicketsScreen () {
  const { data: tickets } = Learner.Queries.useGetTickets()

    return <>
        <Space size={[20,30]} style={{width:'100%'}} direction='vertical'>
            {tickets.map(ticket => {
              return <Link to={ticket._id+''}>
              <TicketItem ticket={ticket} /></Link>;
    })}
        </Space></>
}
