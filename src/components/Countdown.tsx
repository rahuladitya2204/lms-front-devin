import React from 'react'
import dayjs from 'dayjs'
import useCountdownTimer from '@Hooks/useCountdownTimer'

interface CountdownProps {
  targetDate: string;
  hideHour?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  hideHour
}) => {
  const { timeLeft } = useCountdownTimer(targetDate)

  let formattedTimeLeft = `${timeLeft.hours}:${timeLeft.minutes}:${
    timeLeft.seconds
  }`

  if (hideHour) {
    formattedTimeLeft = `${timeLeft.minutes}:${timeLeft.seconds}`
  }

  return <span>{formattedTimeLeft}</span>
}

export default Countdown
