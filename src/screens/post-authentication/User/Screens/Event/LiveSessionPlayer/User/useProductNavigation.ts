import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Types } from '@invinciblezealorg/lms-common'

function useTestNavigation(test: Types.Test) {
  const { questionId: itemId } = useParams()
  const navigate = useNavigate()
  const [currentIndexes, setCurrentIndexes] = useState({
    sectionIndex: -1,
    itemIndex: -1
  })

  // Update indexes whenever itemId or test changes
  useEffect(
    () => {
      test.sections.forEach((section, sIndex) => {
        const iIndex = section?.items?.findIndex(
          i => i._id.toString() === itemId
        )
        if (iIndex !== -1) {
          setCurrentIndexes({ sectionIndex: sIndex, itemIndex: iIndex })
        }
      })
    },
    [itemId, test.sections]
  )

  const navigateTo = useCallback(
    (direction: string) => {
      let { sectionIndex, itemIndex } = currentIndexes

      if (direction === 'next') {
        itemIndex++
        if (itemIndex >= test.sections[sectionIndex].items.length) {
          sectionIndex++
          itemIndex = 0
        }
      } else if (direction === 'prev') {
        itemIndex--
        if (itemIndex < 0 && sectionIndex > 0) {
          sectionIndex--
          itemIndex = test.sections[sectionIndex].items.length - 1
        }
      }

      const isIndexValid =
        sectionIndex >= 0 &&
        sectionIndex < test.sections.length &&
        itemIndex >= 0 &&
        itemIndex < test.sections[sectionIndex].items.length

      if (isIndexValid) {
        const newSectionId = test.sections[sectionIndex]._id
        const newItemId = test.sections[sectionIndex].items[itemIndex]._id
        navigate(`../${newItemId}`)
      }
    },
    [currentIndexes, test.sections, navigate, test._id]
  )

  useEffect(
    () => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight') {
          navigateTo('next')
        } else if (event.key === 'ArrowLeft') {
          navigateTo('prev')
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    },
    [navigateTo]
  )

  return {
    currentSectionIndex: currentIndexes.sectionIndex,
    currentQuestionIndex: currentIndexes.itemIndex,
    navigate: navigateTo
  }
}

export default useTestNavigation
