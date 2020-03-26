
export class ClientTest {
  UserID: string;
  TestID: string;
  TestDate: string;
  TestResult: string;
  ReTestReq: string;
  ReTestDate: string;
  CreatedBy: string;
 
  constructor(data: any) {
    data = data || {};
    this.UserID = data.UserID;
    this.TestID = data.TestID;
    this.TestResult = data.TestResult;
    this.TestDate = data.TestDate;
    this.ReTestReq = data.ReTestReq;
    this.ReTestDate = data.ReTestDate;
    this.CreatedBy = data.CreatedBy;
       
  }
}

