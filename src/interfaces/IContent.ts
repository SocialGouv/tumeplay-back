export interface IContent {
    id: number;
    title: string;
    text: string;
    link: string;
    comment: string;
    published: string;
    pictureId: number;
    themeId: number;
    categoryId: number;
    questionId: number;
}

export interface IContentInputDTO {
    title: string;
    text: string;
    link: string;
    comment: string;
    published: string;
    pictureId: number;
    themeId: number;
    categoryId: number;
    questionId: number;
}
