import { IPicture } from './IPicture';
export interface IQuestionCategory extends IQuestionCommon {
    id: number;
    title: string;
    published: string;
    deleted: boolean;
    pictureId: number;
    themeId: number;
    picture: IPicture;
}

export interface IQuestionCategoryDTO extends IQuestionCommon {
    title: string;
    content?: string;
    published: string | boolean;
    deleted: boolean;
    pictureId: number;
    themeId: number;
}

interface IQuestionCommon {
    isDefaultData?: boolean;
    idFictitious?: number;
    themeIdFictitious?: number;
}
