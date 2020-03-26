export class Option {
  QId: string;
  AnswerID: string;
  AnswerNo: string;
  Answer: string;
  AnswerInd: string;
  selected: boolean;

  constructor(data: any) {
    data = data || {};
    this.QId = data.QId;
    this.AnswerID = data.AnswerID;
    this.AnswerNo = data.AnswerNo;
    this.Answer = data.Answer;
    this.AnswerInd = data.AnswerInd;
    this.selected = false;
    
  }
}


//export class Option {
//  id: number;
//  questionId: number;
//  name: string;
//  isAnswer: boolean;
//  selected: boolean;

//  constructor(data: any) {
//    data = data || {};
//    this.id = data.id;
//    this.questionId = data.questionId;
//    this.name = data.name;
//    this.isAnswer = data.isAnswer;
//  }
//}
