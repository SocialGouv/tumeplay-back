import { IPicture } from './IPicture';
export interface IThematique extends IThematiqueInputDTO {
    id: number;
    picture: IPicture;
}

export interface IThematiqueInputDTO {
    title: string;
    active: string | boolean;
    pictureId: number;
    isDefaultData?: boolean;
    idFictitious?: number;
}
