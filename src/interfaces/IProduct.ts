import { IPicture } from './IPicture';

export interface IProductInputDTO {
    title: string;
    description: string;
    shortDescription: string;
    supplierDescription: string;
    defaultQty: number;
    price: number;
    stock: number;
    isOrderable: boolean;
    active: boolean;
    pictureId: number;
    deleted: boolean;
}

export interface IProduct extends IProductInputDTO {
    id: number;
    picture: IPicture; // got from include ['user']
}
