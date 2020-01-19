import { Component, OnInit } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-db-connection',
  templateUrl: './db-connection.component.html',
  styleUrls: ['./db-connection.component.less']
})
export class DbConnectionComponent implements OnInit {

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
    const result = this.compare.doComparetion();
    if(!result) {
      this.message.create('error','请先连接数据库！');
    } else {
      // 跳转比较结果页面
      this.router.navigate(['compare']);
    }
  }


}
