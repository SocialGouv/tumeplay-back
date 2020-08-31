export interface IContactInputDTO {
    name: string;
    surname: string;
    email: string;
    zipCode: string;
}

export interface IContact extends IContactInputDTO {
    id: number;                              
}
