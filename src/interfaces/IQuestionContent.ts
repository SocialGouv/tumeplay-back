import { IPicture } from './IPicture'
export interface IQuestionContent extends IFictitiousExtension {
  id: number;
  title: string;
  answerText: string;
  content: string;
  published: string | boolean;
  categoryId: number;
  pictureId: number;
  picture: IPicture; // when using include
  update?(questionContent: IQuestionContentDTO): IQuestionContent;
}

export interface IQuestionContentDTO extends IFictitiousExtension {
  title: string;
  answerText: string;
  content: string;
  published: string | boolean;
  categoryId: number;
  pictureId: number;
  rightAnswer?: number;
}

export interface IQuestionContentForDefault {
  key: number;
  id: number
  theme: number
  category: number;
  question: string;
  answers: IQuestionAnswerForDefault[];
  rightAnswer: number;
  explanation: string;
  background: string; // url file
  extras?: any
}

interface IFictitiousExtension {
  defaultPicturePath?: string;
  defaultPicturePathForMob?: string;
  idFictitious?: number;
  categoryIdFictitious?: number;
  isDefaultData?: boolean;
  answersExtras?: IQuestionAnswerForDefault[];
}

interface IQuestionAnswerForDefault {
  id: number;
  text: string
}