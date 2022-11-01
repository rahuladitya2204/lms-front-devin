import create from 'zustand'

interface CourseBuilderState {
    isDrawerOpen: boolean
    setDrawerOpen: (isDrawerOpen: boolean) => void,
  }

const useCourseBuilder = create<CourseBuilderState>(set => ({
    isDrawerOpen: false,
    setDrawerOpen: (isDrawerOpen) => set(state => ({ isDrawerOpen: isDrawerOpen })),
}))

export default useCourseBuilder;
