export enum QuestionType {
    None=1,
  MultipleChoice,
  MultipleResponse,
  DaragAndDrop,
}
type Additions = {
    [key: string]: Answers;
};

export class Question {
  constructor(
    public text: string,
    public type: string,
    public points: number,
    public answers: Additions,
    public picture?: string,
    public created = new Date().toISOString().slice(0, 10),
    public modified = new Date().toISOString().slice(0, 10),
    public id: number | undefined = undefined
  ) {}
}

  
export class Answers {
  static nextId: number = 0;
  id = ++Answers.nextId;

  constructor(
    public scorePerc: string,
    public text?: string,
    public picture?: string,
    public created = new Date().toISOString().slice(0, 10),
    public modified = new Date().toISOString().slice(0, 10)
  ) {}
}
