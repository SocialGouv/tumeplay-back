import { IUser } from './IUser';

export interface IShippingAddressInputDTO {
  num: string;
  street: string;
    streetMore: string;
  cp: string;
  city: string;
  concatenation: string;
  zipCode: string;
  userId: string;
}

export interface IShippingAddress extends IShippingAddressInputDTO {
  id: number;
  user: IUser;  // got from include ['user']
}
