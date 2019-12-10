import {IPicture} from './IPicture';
export interface IThematique {
  id		        :   number;
  title		      :   string;
  active	      :   string;
  pictureId     :   number;
  picture   :   IPicture  // need to INCLUDE in search to get this data
}

export interface IThematiqueInputDTO {
  title		      :   string;
  active	      :   string;
  pictureId     :   number;
}