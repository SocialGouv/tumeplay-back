interface IProductOrderMain {
  productId:number;
  orderId:number;
}

export interface IProductOrderInputDTO extends IProductOrderMain { }

export interface IProductOrder extends IProductOrderMain {
  id: number;
}
