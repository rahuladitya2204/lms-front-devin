export const EmailTypeMap: any = {
  'learner/signup': {
    title: 'Learner Sign Up',
    description: 'Welcome email when learner signs up'
  },
  'learner/course/enroll': {
    title: 'Learner Enrolls for a course',
    description: 'Welcome email with course details when learner enrolls'
  },
  'learner/ticket/reply': {
    title: 'Learner Ticket Reply',
    description: 'When someone replies to a ticket'
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
