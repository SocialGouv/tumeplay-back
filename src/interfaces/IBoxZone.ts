interface IBoxZoneMain {
    availabilityZoneId: number;
    boxId: number;
}

export interface IBoxZoneDTO extends IBoxZoneMain {}

export interface IBoxZone extends IBoxZoneMain {
    id: number;
}
