export interface IContent {
    id: number;
    title: string;
    text: string;
    published: string;
    pictureId: number;
    themeId: number;
    categoryId: number;
}

export interface IContentInputDTO {
    title: string;
    text: string;
    published: string;
    pictureId: number;
    themeId: number;
    categoryId: number;
}
