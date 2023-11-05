import { useEffect, useState } from 'react'

import dayjs from 'dayjs'

function useCountdownTimer(startDate: string, durationInMinutes: number) {
  const [percentLeft, setPercentLeft] = useState(100)
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  useEffect(
    () => {
      const interval = setInterval(() => {
        const now = dayjs()
        const start = dayjs(startDate)
        const end = start.add(durationInMinutes, 'minute')
        const totalSeconds = end.diff(start, 'second')
        const secondsElapsed = now.diff(start, 'second')
        const secondsLeft = totalSeconds - secondsElapsed

        if (secondsLeft > 0) {
          setPercentLeft(secondsLeft / totalSeconds * 100)

          const hours = Math.floor(secondsLeft / 3600)
            .toString()
            .padStart(2, '0')
          const minutes = Math.floor((secondsLeft % 3600) / 60)
            .toString()
            .padStart(2, '0')
          const seconds = Math.floor(secondsLeft % 60)
            .toString()
            .padStart(2, '0')

          setTimeLeft({ hours, minutes, seconds })
        } else {
          clearInterval(interval)
          setPercentLeft(0)
          setTimeLeft({
            hours: '00',
            minutes: '00',
            seconds: '00'
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    },
    [startDate, durationInMinutes]
  )

  return { percentLeft, timeLeft }
}

export default useCountdownTimer
