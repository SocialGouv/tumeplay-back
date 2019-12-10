
interface IOrderMain {
  title: string;
  orderDate: Date;
  sent: boolean;
  delivered: boolean;
  shippingModeId: number;
  shippingAddressId: number;
  profileId: number;
}

export interface IOrderInputDTO extends IOrderMain { }

export interface IOrder extends IOrderMain {
  id: number;
}
