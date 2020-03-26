export class ResultSummary {
  TestDateFrom: string;
  TestDateTo: string;
  UserName: string;
  TestResult: string;
  RetestDateFrom: string;
  RetestDateTo: boolean;

  constructor(data: any) {
    data = data || {};
    this.TestDateFrom = data.TestDateFrom;
    this.TestDateTo = data.TestDateTo;
    this.UserName = data.UserName;
    this.TestResult = data.TestResult;
    this.RetestDateFrom = data.RetestDateFrom;
    this.RetestDateTo = data.RetestDateTo;
    
  }
}


