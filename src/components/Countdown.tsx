import React, { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
const [timeLeft, setTimeLeft] = useState<string>('');
  useEffect(
    () => {
      const intervalId = setInterval(() => {
        const now = new Date()
        const difference = targetDate.getTime() - now.getTime()

        if (difference > 0) {
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
          const minutes = Math.floor((difference / 1000 / 60) % 60)
          const seconds = Math.floor((difference / 1000) % 60)

          const formattedTimeLeft = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':')

          setTimeLeft(formattedTimeLeft)
        } else {
          clearInterval(intervalId)
          setTimeLeft('00:00:00')
        }
      }, 1000)

      return () => clearInterval(intervalId)
    },
    [targetDate]
  )

  return <span>{timeLeft}</span>
}

export default Countdown
