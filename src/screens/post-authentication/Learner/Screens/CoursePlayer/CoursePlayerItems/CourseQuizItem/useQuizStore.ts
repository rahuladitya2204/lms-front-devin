import { Types } from '@adewaskar/lms-common'
import create from 'zustand'

interface Question extends Types.CourseQuizQuestion {
  answered: number[];
  isAnswerChecked: boolean;
  isCorrectAnswer: boolean;
}

type QuizStore = {
  questions: Question[],
  saveAnswer: (questionIndex: number, answerIndex: number) => void,
  checkAnswer: (questionIndex: number) => void
  setQuestions: (questions: Question[]) => void,

}

export const useQuizStore =
  create <
  QuizStore >
  (set => ({
    questions: [],
    setQuestions: (questions) => set(() => ({ questions })),  
    saveAnswer: (questionIndex, answerIndex) =>
      set(state => {
        const newQuestions = [...state.questions]
        const question = newQuestions[questionIndex]
        if (question.type === 'single') {
          question.answered = [answerIndex]
        } else {
          if (!question.answered) {
            question.answered = [];
          }
          const index = question.answered.indexOf(answerIndex)
          if (index === -1) {
            question.answered.push(answerIndex)
          } else {
            question.answered.splice(index, 1)
          }
        }
        question.isAnswerChecked = false
        return { questions: newQuestions }
      }),
    checkAnswer: questionIndex =>
      set(state => {
        const newQuestions = [...state.questions]
        const question = newQuestions[questionIndex]
        question.isAnswerChecked = true
        question.isCorrectAnswer =
          question.answered.join(',') === question.correctOptions.join(',')
        return { questions: newQuestions }
      })
  }))
