import { IPicture } from './IPicture';

export interface IProductInputDTO {
    title: string;
    description: string;
    price: number;
    active: boolean;
    pictureId: number;
    deleted: boolean;
}

export interface IProduct extends IProductInputDTO {
    id: number;
    picture: IPicture; // got from include ['user']
}
