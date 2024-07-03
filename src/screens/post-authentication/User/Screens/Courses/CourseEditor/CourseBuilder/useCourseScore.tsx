import { Constants, Types } from "@adewaskar/lms-common";

import create from "zustand";

interface CourseStoreState {
  course: Types.Course;
  currentItem: Types.CourseSectionItem;
  setCourse: (course: Partial<Types.Course>) => void;
  setCurrentItem: (course: Types.CourseSectionItem) => void;
  updateSection: (
    id: string,
    newSectionData: Partial<Types.CourseSection>
  ) => void;
  updateItem: (
    itemId: string,
    newItemData: Partial<Types.CourseSectionItem>
  ) => void;
  // Add other methods as needed
}

export const useCourseStore = create<CourseStoreState>((set) => ({
  course: Constants.INITIAL_COURSE_DETAILS,
  currentItem: Constants.INITIAL_COURSE_SECTION_ITEM_DETAILS,
  setCourse: (course) => {
    set((state) => ({
      course: {
        ...state.course,
        ...course,
      },
    }));
  },
  setCurrentItem: (question) => {
    set((state) => ({
      currentItem: question,
    }));
  },
  updateItem: (itemId, newItemData) => {
    set((state) => {
      const updatedSections = state.course.sections.map((section) => {
        // Map through items in each section and update the item with matching itemId
        const updatedItems = section.items.map((item) =>
          item._id === itemId ? { ...item, ...newItemData } : item
        );
        return { ...section, items: updatedItems };
      });
      return { course: { ...state.course, sections: updatedSections } };
    });
  },
  updateSection: (sectionId, newItemData) => {
    set((state) => {
      const updatedSections = state.course.sections.map((section) => {
        // Map through items in each section and update the item with matching itemId
        if (section?._id === sectionId) {
          return {
            ...section,
            ...newItemData,
          };
        }
        return { ...section };
      });
      return { course: { ...state.course, sections: updatedSections } };
    });
  },

  // Add other methods as needed
}));
