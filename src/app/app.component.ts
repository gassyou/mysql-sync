import { Component, OnInit } from '@angular/core';
import { TableKeyType } from './mySql/table-key-type';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title = 'mysql-sync';

  ngOnInit(): void {
    console.log(TableKeyType.PRIMARY_KEY);
  }
}
