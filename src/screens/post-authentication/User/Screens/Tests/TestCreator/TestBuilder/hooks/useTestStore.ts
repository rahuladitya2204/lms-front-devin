import { Constants, Types } from '@adewaskar/lms-common'

import create from 'zustand'

interface TestStoreState {
  test: Types.Test;
  currentQuestion: Types.TestQuestion;
  setTest: (test: Partial<Types.Test>) => void;
  setCurrentQuestion: (test: Types.TestQuestion) => void;
  updateSection: (
    id: string,
    newSectionData: Partial<Types.TestSection>
  ) => void;
  updateItem: (
    itemId: string,
    newItemData: Partial<Types.TestQuestion>
  ) => void;
  // Add other methods as needed
}

export const useTestStore =
  create <
  TestStoreState >
  (set => ({
    test: Constants.INITIAL_TEST_DETAILS,
    currentQuestion: Constants.INITIAL_TEST_QUESTION,

    setTest: test => {
      set(state => ({
        test: {
          ...state.test,
          ...test
        }
      }))
    },
    setCurrentQuestion: question => {
      set(state => ({
        currentQuestion: question
      }))
    },
    updateItem: (itemId, newItemData) => {
      set(state => {
        const updatedSections = state.test.sections.map(section => {
          // Map through items in each section and update the item with matching itemId
          const updatedItems = section.items.map(
            item => (item._id === itemId ? { ...item, ...newItemData } : item)
          )
          return { ...section, items: updatedItems }
        })
        return { test: { ...state.test, sections: updatedSections } }
      })
    },
    updateSection: (sectionId, newItemData) => {
      set(state => {
        const updatedSections = state.test.sections.map(section => {
          // Map through items in each section and update the item with matching itemId
          if (section?._id === sectionId) {
            return {
              ...section,
              ...newItemData
            }
          }
          return { ...section }
        })
        return { test: { ...state.test, sections: updatedSections } }
      })
    }

    // Add other methods as needed
  }))
