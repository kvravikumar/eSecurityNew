//import { Answer } from './answer';

import { Option } from './option';

//export class Question {
//  id: number;
//  name: string;
//  questionTypeId: number;
//  options: Option[];
//  answered: boolean;
//  isCorrect: boolean;

//  constructor(data: any) {
//    data = data || {};
//    this.id = data.id;
//    this.name = data.name;
//    this.questionTypeId = data.questionTypeId;
//    this.isCorrect = data.isCorrect;
//    this.options = [];
//    data.options.forEach(o => {
//      this.options.push(new Option(o));
//    });
//  }
//}

export class Question {
  SetID: string;
  userid:string;
  QID: string;
  QNo: string;
  Question: string;
  AnswerType: string;
  options: Option[];
  answered: boolean;
  passInd: boolean
  
  constructor(data: any) {
    data = data || {};
    this.SetID = data.SetID;
    this.QID = data.QID;
    this.QNo = data.QNo;
    this.Question = data.Question;
    this.AnswerType = data.AnswerType;
    this.passInd = data.passInd;
    this.options = [];
    data.AnswersModel.forEach(o => {
      this.options.push(new Option(o));
    });
  }
}

