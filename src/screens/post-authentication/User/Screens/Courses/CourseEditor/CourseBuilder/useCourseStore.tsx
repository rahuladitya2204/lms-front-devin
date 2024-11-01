import { Constants, Types } from '@adewaskar/lms-common';
import create from 'zustand';
import merge from 'lodash.merge';
import { getReadingTime } from './utils';

interface CourseStoreState {
  course: Types.Course;
  currentItem: Types.CourseSectionItem;
  setCourse: (course: Partial<Types.Course>) => void;
  language: string;
  setLanguage: (language: string) => void;
  setCurrentItem: (item: Types.CourseSectionItem) => void;
  updateSection: (
    id: string,
    newSectionData: Partial<Types.CourseSection>
  ) => void;
  updateItem: (
    itemId: string,
    newItemData: Partial<Types.CourseSectionItem>
  ) => void;
}

export const useCourseStore = create<CourseStoreState>((set) => ({
  course: Constants.INITIAL_COURSE_DETAILS,
  language: 'eng',
  currentItem: Constants.INITIAL_COURSE_SECTION_ITEM_DETAILS,
  setCourse: (course) => {
    set((state) => ({
      course: {
        ...state.course,
        ...course,
      },
    }));
  },
  setLanguage: (language) => {
    set(() => ({
      language,
    }));
  },
  setCurrentItem: (item: string) => {
    set(() => {
      return ({
        currentItem: item,
      })
    });
  },
  updateItem: (itemId, newItemData) => {
    set((state) => {
      const updatedSections = state.course.sections.map((section) => {
        const updatedItems = section.items.map((item) => {
          if (item._id === itemId) {
            const mergedItem = merge({}, item, newItemData);
            return mergedItem;
          }
          return item;
        });
        return { ...section, items: updatedItems };
      });
      return { course: { ...state.course, sections: updatedSections } };
    });
  },
  updateSection: (sectionId, newItemData) => {
    set((state) => {
      const updatedSections = state.course.sections.map((section) => {
        if (section?._id === sectionId) {
          return {
            ...section,
            ...newItemData,
          };
        }
        return section;
      });
      return { course: { ...state.course, sections: updatedSections } };
    });
  },
}));
