//import { Answer } from './answer';

import { Quiz } from './quiz';

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

export class TestUser {
  UserID: string;
  CreatedBy: string;
  quiz: Quiz[]

  constructor(data: any) {
    data = data || {};
    this.UserID = data.UserID;
    this.CreatedBy = data.CreatedBy;
    this.quiz = [];
    data.forEach(o => {
      this.quiz.push(new Quiz(o));
    });
  }
}

