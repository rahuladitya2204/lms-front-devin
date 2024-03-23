import { Learner, Store } from '@invinciblezealorg/lms-common'
import { useEffect, useRef } from 'react'

import Plyr from 'plyr'

const WATCHTIME_UPDATE_API_DELAY = 60000

const useWatchTime = (courseId: string) => {
  const player = Store.usePlayer(s => s.state.playerInstance)
  const watchTime = useRef(0)
  const lastTimestamp = useRef(Date.now())
  const {
    mutate: updateWatchTimeHandler
  } = Learner.Queries.useUpdateCourseWatchTime()
  useEffect(
    () => {
      try {
        if (player && player.on) {
          const timeUpdateHandler = () => {
            const currentTimestamp = Date.now()
            // console.log(currentTimestamp, 'currentTimestamp')
            const timeSpent = currentTimestamp - lastTimestamp.current
            watchTime.current += timeSpent

            lastTimestamp.current = currentTimestamp

            // Update watch time every minute or choose your own duration
            if (watchTime.current >= WATCHTIME_UPDATE_API_DELAY) {
              updateWatchTimeHandler({
                watchTime: Math.ceil(watchTime.current / 1000),
                courseId: courseId
              })
              watchTime.current = 0
            }
          }
          player.on('timeupdate', timeUpdateHandler)
          return () => {
            if (player) {
              player.off('timeupdate', timeUpdateHandler)
            }
          }
        }
      } catch (er) {
        // console.log(er, 'er')
      }

      // Clean up event listener when the component is unmounted
    },
    [player]
  )
}

export default useWatchTime
