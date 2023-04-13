export const EmailTypeMap: any = {
  'learner/signup': {
    title: 'Learner Sign Up',
    description: 'Welcome email when learner signs up',
    variables: [
      {
        value: 'learner.name',
        name: 'Learner Name'
      }
    ]
  },
  'learner/course/enroll': {
    title: 'Learner Enrolls for a course',
    description: 'Welcome email with course details when learner enrolls',
    variables: [
      {
        value: 'course.title',
        name: 'Course Title'
      },
      {
        value: 'learner.name',
        name: 'Learner Name'
      },
      {
        value: 'course.instructor.name',
        name: 'Instructor Name'
      }
    ]
  },
  'learner/ticket/reply': {
    title: 'Learner Ticket Reply',
    description: 'When someone replies to a ticket',
    variables: [
      {
        name: 'Ticket Subject',
        value: 'ticket.subject'
      },
      {
        name: 'Ticket Id',
        value: 'ticket.id'
      },
      {
        name: 'Learner Reply Text',
        value: 'ticket.replyText'
      },
      {
        name: 'Ticket Category',
        value: 'ticket.category.title'
      },
      {
        name: 'Learner Name',
        value: 'learner.name'
      }
    ]
  },
  'learner/ticket/status-update': {
    title: 'Learner Ticket Opened/Closed',
    description: 'When someone updates status of the ticket'
  },
  'learner/password-reset': {
    title: 'Learner Password Reset',
    description: 'When learner asks for reset password link'
  },
  'learner/reply-to-post': {
    title: 'Learner Reply to Post',
    description: 'Welcome someone replies on a discussion post'
  }
}

export const EmailTemplateStatusMap: any = {
  draft: {
    title: 'Draft',
    color: 'cyan'
  },
  live: {
    title: 'Live',
    color: 'magenta'
  }
}
