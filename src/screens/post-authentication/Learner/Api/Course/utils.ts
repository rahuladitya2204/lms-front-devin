import { Types } from '@adewaskar/lms-common'

export const calcCourseProgress = ({
  course,
  completed
}: Types.EnrolledCourseDetails) => {
  let totalItems = 0,
    completedCourses = 0
  course.sections.forEach((s: Types.CourseSection) => {
    s.items.forEach((i: Types.CourseSectionItem) => {
      totalItems += 1
      if (completed.indexOf(i._id)) {
        completedCourses += 1
        i.isCompleted = true
      }
    })
  })
  const progress = Math.ceil(completedCourses / totalItems * 100);
  return { course, progress, completed }
}
