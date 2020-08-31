interface IOrderZoneMain {
    availabilityZoneId: number;
    orderId: number;
}

export interface IOrderZoneDTO extends IOrderZoneMain {}

export interface IOrderZone extends IOrderZoneMain {
    id: number;
}
