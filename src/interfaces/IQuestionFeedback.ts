export interface IQuestionFeedbackDTO {
    questionContentId: number;
    isLiked: boolean;
    isDisliked: boolean;
    comment: string;
}

export interface IQuestionFeedback extends IQuestionFeedbackDTO {
    id: number;
}
