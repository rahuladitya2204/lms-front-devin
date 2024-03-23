import { Badge, Calendar as LibCalendar } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import React from 'react';
// import 'antd/dist/antd.css';
import { Types } from '@adewaskar/lms-common';

// interface Event {
//   _id: string;
//   title: string;
//   description?: string;
//   type: 'webinar' | 'conversational' | 'offline';
//   scheduledAt: Date;
// }

interface AppProps {
    events: Types.Event[];
    onDayClick?: (date: Date) => void;
}

const getListData = (value: Dayjs, events: Types.Event[]) => {
  return events.filter(event =>
    dayjs(event.scheduledAt).isSame(value, 'day')
  ).map(event => ({
    type: 'warning', // You can adjust the mapping as necessary
    content: event.title,
  }));
};

const getMonthData = (value: Dayjs, events: Types.Event[]) => {
  const eventsInMonth = events.filter(event =>
    dayjs(event.scheduledAt).isSame(value, 'month')
  );
  return eventsInMonth.length;
};

const Calendar: React.FC<AppProps> = ({ events ,onDayClick}) => {
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value, events);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <li key={index} onClick={() => onDayClick&&onDayClick(value.toDate())}>
            <Badge status={item.type as BadgeProps['status']} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value, events);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Event count</span>
      </div>
    ) : null;
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return <LibCalendar cellRender={cellRender} />;
};

export default Calendar;