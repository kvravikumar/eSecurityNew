

import { TestOption } from './TestOption';


export class TestQuestion {
    TestID: string;
  SetID: string;
  QID: string;
  QNo: string;
  Question: string;
  AnswerType: string;
  PassInd:string;
  options: TestOption[];
 
  
  constructor(data: any) {
    data = data || {};
    this.SetID = data.SetID;
    this.QID = data.QID;
    this.QNo = data.QNo;
    this.Question = data.Question;
    this.AnswerType = data.AnswerType;
    this.PassInd = data.PassInd;
    this.options = [];
    data.AnswersModel.forEach(o => {
      this.options.push(new TestOption(o));
    });
  }
}

