export class TestOption {
    TestID:string;
    QuesId: string;
    AnswerID: string;
    AnswerNo: string;
    Answer: string;
    AnswerInd: string;
    USER_SELECTED: boolean;
  
    constructor(data: any) {
      data = data || {};
      this.TestID = data.TestID;
      this.QuesId = data.QuesId;
      this.AnswerID = data.AnswerID;
      this.AnswerNo = data.AnswerNo;
      this.Answer = data.Answer;
      this.AnswerInd = data.AnswerInd;
      this.USER_SELECTED = false;
      
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
  