import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/Test.service';
import { TestModal } from '../models/TestModal';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {

  
  TestID:string;
  testModal: TestModal;
  constructor(private TestService:TestService,private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {

    this.getQuesrString();

    this.TestService.GetTestModalById(this.TestID).subscribe(res => {
      this.testModal =new TestModal(res);
      
    },
      (error) => {
        var ss = error.message;
      }
    );
    
  }

  getQuesrString()
  {
    this.activatedRoute.queryParams.subscribe(params => {
      this.TestID=params['TestID'];
      
    });

    
 
  }

}


