export interface AnswerResponse {
  id: number
  question: string
  description: string
  answers: Answers
  multiple_correct_answers: string
  correct_answers: CorrectAnswers
  explanation: string
  tip: string | null
  tags: unknown[]
  category: string
  difficulty: string
}

export interface Answers {
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  answer_e: string | null
  answer_f: string | null
}

export interface CorrectAnswers {
  answer_a_correct: "true" | "false"
  answer_b_correct: "true" | "false"
  answer_c_correct: "true" | "false"
  answer_d_correct: "true" | "false"
  answer_e_correct: "true" | "false"
  answer_f_correct: "true" | "false"
}
