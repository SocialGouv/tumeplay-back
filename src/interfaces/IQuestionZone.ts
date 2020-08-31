interface IQuestionZoneMain {
    availabilityZoneId: number;
    questionContentId: number;
}

export interface IQuestionZoneDTO extends IQuestionZoneMain {}

export interface IQuestionZone extends IQuestionZoneMain {
    id: number;
}
