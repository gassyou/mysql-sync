import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-db-connection',
  templateUrl: './db-connection.component.html',
  styleUrls: ['./db-connection.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbConnectionComponent implements OnInit {


  keyCompareNeed = false;
  functionCompareNeed = false;

  constructor(
    public compare: CompareService,
    private message: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {}

  doConnection() {
    this.compare.connection$.next(true);
  }

  doNext() {
    if(!this.compare.isConnected()) {
      this.message.create('error','请先连接数据库！');
    } else {
      this.compare.keyCompareNeed = this.keyCompareNeed;
      this.compare.functionCompareNeed = this.functionCompareNeed;
      this.router.navigate(['compare']);
    }
  }


}
