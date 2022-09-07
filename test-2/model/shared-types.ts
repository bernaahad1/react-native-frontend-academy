export enum Views {
  EditingQuestions = 1,
  AddQuestion,
  StartTest,
  ViewResults,
  }

  export type IdType = number | undefined;

  export type FormFieldDict<Value> = {
    [field: string]: Value;
  };

export type Optional<T> = T | undefined;
  
export interface ImageData {
  uri: string;
  localUri?: string;
  format?: string;
  width?: number;
  height?: number;
}