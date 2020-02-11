import { IProfile } from './IProfile';
import { IShippingAddress } from './IShippingAddress';
import { IShippingMode } from './IShippingMode';
import { ICommonDates } from './commonInterfaces/IDates';
import { IProduct } from './IProduct';
import { IBox } from './IBox';

interface IOrderMain extends ICommonDates {
    orderDate: Date;
    sent: boolean;
    delivered: boolean;
    shippingModeId: number;
    shippingAddressId: number;
    profileId: number;
    userId: number;
    pickupId: number;
}

interface IOrderIncludedFields {
    profile?: IProfile;
    shippingAddress?: IShippingAddress;
    shippingMode?: IShippingMode;
    products?: IProduct[];
    box?: IBox;
}

export interface IOrderInputDTO extends IOrderMain {
    id?: number; // in case id is needed in updates
    productIds?: number[];
}

export interface IOrder extends IOrderMain, IOrderIncludedFields {
    id: number;
}

export interface IOrderMainView extends IOrderMain, IOrderIncludedFields {
    id: number;
    profileFullName: string;
    shippingAddressConcatenation: string;
    shippingModeText: string;
    profileFirstName: string;
}
