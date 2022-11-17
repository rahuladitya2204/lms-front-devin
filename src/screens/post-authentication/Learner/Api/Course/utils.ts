import {
  CourseSection,
  CourseSectionItem,
  EnrolledCourseDetails
} from '@Types/Courses.types'

export const calcCourseProgress = ({
  course,
  completed
}: EnrolledCourseDetails) => {
  let totalItems = 0,
    completedCourses = 0
  course.sections.forEach((s: CourseSection) => {
    s.items.forEach((i: CourseSectionItem) => {
      totalItems += 1
      if (completed.indexOf(i._id)) {
        completedCourses += 1
        i.isCompleted = true
      }
    })
  })
  const progress = completedCourses / totalItems * 100
  return { course, progress, completed }
}
