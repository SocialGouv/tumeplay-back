import { IPicture } from './IPicture';
export interface IThematique extends IThematiqueInputDTO {
    id: number;
    picture: IPicture;
    isSpecial:boolean
}

export interface IThematiqueInputDTO {
    title: string;
    active: string | boolean;
    pictureId: number;
    isDefaultData?: boolean;
    idFictitious?: number;
    isSpecial:string | boolean

}
