
export interface IContent {
  id: number;
  title: string;
  text: string;
  published: string;
  pictureId: number;
}

export interface IContentInputDTO {
  title: string;
  text: string;
  published: string;
  pictureId: number;
}