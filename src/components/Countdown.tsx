import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: string;
  hideHour?: boolean;
}

const Countdown: React.FC<CountdownProps> = ({
  targetDate: TDate,
  hideHour
}) => {
  const targetDate = dayjs(TDate).toDate()
  const [timeLeft, setTimeLeft] = useState<string>('00:00')
  useEffect(
    () => {
      const intervalId = setInterval(() => {
        const now = new Date()
        const difference = targetDate.getTime() - now.getTime()

        if (difference > 0) {
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((difference / 1000 / 60) % 60)
          const seconds = Math.floor((difference / 1000) % 60)

          let formattedTimeLeft = [
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ]
          if (!hideHour) {
            formattedTimeLeft.unshift(hours.toString().padStart(2, '0'))
          }
          const FinalFormatted = formattedTimeLeft.join(':')
          setTimeLeft(FinalFormatted)
        } else {
          clearInterval(intervalId)
          if (hideHour) {
            setTimeLeft('00:00')
          } else {
            setTimeLeft('00:00:00')
          }
        }
      }, 1000)

      return () => clearInterval(intervalId)
    },
    [targetDate]
  )

  return <span>{timeLeft}</span>
}

export default Countdown
