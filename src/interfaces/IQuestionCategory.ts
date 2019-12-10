import {IPicture} from './IPicture';  
export interface IQuestionCategory {
  id		    : number;
  title		  : string;
  published	: string;
  deleted   : boolean;
  pictureId : number;
  themeId   : number;
  picture: IPicture;
}

export interface IQuestionCategoryDTO {
  title		  : string;
  content	  : string;
  published	: string;
  deleted   : boolean;
  pictureId : number;
  themeId   : number;
}