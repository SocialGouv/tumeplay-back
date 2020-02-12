import { IUser } from './IUser';

export interface IProfileInputDTO {
    name: string;
    surname: string;
    email: string;
    userId: string;
}

export interface IProfile extends IProfileInputDTO {
    id: number;
    user: IUser; // got from include:['user']
}
