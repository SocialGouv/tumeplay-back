interface IBoxProductMain {
    qty: number;
    productId: number;
    boxId: number;
}

export interface IBoxProductInputDTO extends IBoxProductMain {}

export interface IBoxProduct extends IBoxProductMain {
    id: number;
}
