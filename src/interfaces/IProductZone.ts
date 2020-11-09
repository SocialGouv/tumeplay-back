interface IProductZoneMain {
    availabilityZoneId: number;
    ProductId: number;
}

export interface IProductZoneDTO extends IProductZoneMain {}

export interface IProductZone extends IProductZoneMain {
    id: number;
}
