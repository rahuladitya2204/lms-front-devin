import { Enum, Types } from '@adewaskar/lms-common'

import create from 'zustand'

export interface Question extends Types.TestQuestion {
  answered?: number[];
  isAnswerChecked?: boolean;
  isCorrectAnswer?: boolean;
}

type QuizStore = {
  questions: Question[],
  saveAnswer: (questionIndex: number, answerIndex: number) => void,
  checkAnswer: (questionIndex: number) => void
  setQuestions: (questions: Question[]) => void,
  resetQuestions:()=>void;

}

export const useQuizStore =
  create <
  QuizStore >
  (set => ({
    questions: [],
    resetQuestions: () => set((state) => {
      const newQuestions = [...state.questions]
      newQuestions.forEach(q=>{
        delete q.isAnswerChecked;
        delete q.isCorrectAnswer;
        delete q.answered;
      })
      return { questions: newQuestions }
    }),  
    setQuestions: (questions) => set(() => ({ questions })),  
    saveAnswer: (questionIndex, answerIndex) =>
      set(state => {
        const newQuestions = [...state.questions]
        const question = newQuestions[questionIndex]
        if (question.type === Enum.TestQuestionType.SINGLE) {
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
        // question.isCorrectAnswer =
        //   question?.answered?.join(',') === question.correctOptions.join(',')
        return { questions: newQuestions }
      })
  }))
