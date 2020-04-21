export interface IQuestionAnswer extends IQuestionAnswerMain {
    id: number;
}

export interface IQuestionAnswerDTO extends IQuestionAnswerMain {}

interface IQuestionAnswerMain {
    title: string;
    questionContentId: number;
    isCorrect: boolean;
    isNeutral: boolean;
    published: boolean | string;
    idFictitiousInTheQuestion?: number;
    isDefaultData?: boolean;
}
