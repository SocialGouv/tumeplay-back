export interface IContactInputDTO {
    name: string;
    surname: string;
    email: string;
    zipCode: string;
}

export interface IProfile extends IContactInputDTO {
    id: number;                              
}
