import { Component, OnInit } from '@angular/core';
import { CompareService } from '../service/compare.service';

@Component({
  selector: 'app-db-connection',
  templateUrl: './db-connection.component.html',
  styleUrls: ['./db-connection.component.less']
})
export class DbConnectionComponent implements OnInit {

  constructor(
    public compare: CompareService
  ) { }

  ngOnInit() {
  }

  doConnection() {
    this.compare.connection$.next(true);
  }

  doNext() {

  }


}
