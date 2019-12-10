import { Model } from "sequelize";

import { IUser } from '../../interfaces/IUser';
import { IThematique } from '../../interfaces/IThematique';
import { IPicture } from '../../interfaces/IPicture';
import { IQuestionCategory } from '../../interfaces/IQuestionCategory';
import { IQuestionContent } from '../../interfaces/IQuestionContent';
import { IQuestionAnswer } from '../../interfaces/IQuestionAnswer';
import { IProduct } from '../../interfaces/IProduct';
import { IShippingMode } from '../../interfaces/IShippingMode';
import { IOrder } from '../../interfaces/IOrder';
import { IProductOrder } from '../../interfaces/IProductOrder';

declare global 
{
  namespace Express 
  {
    export interface Request 
    {
      //currentUser: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser>;
    export type PictureModel = Model<IPicture>;
    export type ThematiqueModel = Model<IThematique>;
    export type QuestionCategoryModel = Model<IQuestionCategory>;
    export type QuestionContentModel = Model<IQuestionContent>;
    export type QuestionAnswerModel = Model<IQuestionAnswer>;
    export type ProductModel = Model<IProduct>;
    export type ShippingModeModel = Model<IShippingMode>;
    export type OrderModel = Model<IOrder>;
    export type ProductOrderModel = Model<IProductOrder>;
  }
}
