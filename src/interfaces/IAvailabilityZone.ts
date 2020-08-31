export interface IAvailabilityZone {
    id: number;
    name: string;
    enabled: boolean;
}

export interface IAvailabilityZoneDTO {
    name?: string;
    enabled: boolean;
}
