import { QuizConfig } from './quiz-config';
import { Question } from './question';
//import { Answer } from './answer';

//export class Quiz {
//  id: number;
//  name: string;
//  description: string;
//  config: QuizConfig;
//  questions: Question[];

//  constructor(data: any) {
//    if (data) {
//      this.id = data.id;
//      this.name = data.name;
//      this.description = data.description;
//      this.config = new QuizConfig(data.config);
//      this.questions = [];
//      data.questions.forEach(q => {
//        this.questions.push(new Question(q));
//      });
//    }
//  }
//}

export class Quiz {
  config: QuizConfig;
  questions: Question[];

  constructor(data: any) {
    if (data) {
      this.config = new QuizConfig(data.config);
      this.questions = [];
      //  this.options = [];

      //for (let i = 0; i < data.length; i++) {
      //  console.log("Block statement execution no." + i);
      //}
      data.forEach(q => {
        this.questions.push(new Question(q));

        //for (var i = 0; i < q.AnswersModel.length; i++) {
        //  this.options.push(new Answer(q.AnswersModel[i]))
        //}

      });
    }
  }
}
