interface IContentZoneMain {
    availabilityZoneId: number;
    ContentId: number;
}

export interface IContentZoneDTO extends IContentZoneMain {}

export interface IContentZone extends IContentZoneMain {
    id: number;
}
