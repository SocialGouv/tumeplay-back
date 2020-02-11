export interface IPoi {
    id?: number;
    name?: string;
    description?: string;
    type?: string;
    zipCode?: string;
    street?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    horaires?: string;
    active?: boolean;
}

export interface IPoiInputDTO {
    name?: string;
    description?: string;
    type?: string;
    zipCode?: string;
    street?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    horaires?: string;
    active?: boolean;
}
