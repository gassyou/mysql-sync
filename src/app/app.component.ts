import { Component, OnInit } from '@angular/core';
import { TableKeyType } from './mySql/table-key-type';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  title = 'mysql-sync';

  ngOnInit(): void {
  }
}
