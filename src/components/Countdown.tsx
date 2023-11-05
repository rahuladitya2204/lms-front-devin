import React from 'react';
import dayjs from 'dayjs';
import useCountdownTimer from '@Hooks/useCountdownTimer';

interface CountdownProps {
  targetDate: string;
  hideHour?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate, hideHour }) => {
  const startTime = dayjs().toISOString(); // Current time as the start
  const duration = dayjs(targetDate).diff(startTime, 'minute'); // Calculate duration until target time in minutes

  const { timeLeft } = useCountdownTimer(startTime, duration);

  let formattedTimeLeft = `${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`;

  if (hideHour) {
    formattedTimeLeft = `${timeLeft.minutes}:${timeLeft.seconds}`;
  }

  return <span>{formattedTimeLeft}</span>;
};

export default Countdown;
