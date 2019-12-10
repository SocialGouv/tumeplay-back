
export interface IQuestionAnswer {
  id: number;
  title: string;
  questionContentId: number;
  isCorrect: boolean;
  published: boolean;
}

export interface IQuestionAnswerDTO {
  title: string;
  questionContentId: number;
  isCorrect: boolean;
  published: boolean;
}