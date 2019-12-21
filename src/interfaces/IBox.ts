import { IPicture } from './IPicture';

export interface IBoxInputDTO {
  title: string;
  description: string;
  price: number;
  active: boolean;
  pictureId: number;
  deleted: boolean;
}

export interface IBox extends IBoxInputDTO {
  id: number;
  picture: IPicture;  // got from include ['user']
}
