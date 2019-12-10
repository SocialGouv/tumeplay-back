import {IPicture} from './IPicture'
export interface IQuestionContent {
  id: number;
  title: string;
  answerText: string;
  content: string;
  published: string;
  categoryId: number;
  pictureId: number;
  picture: IPicture; // when using include
}

export interface IQuestionContentDTO {
  title: string;
  answerText: string;
  content: string;
  published: string;
  categoryId: number;
  pictureId: number;
}