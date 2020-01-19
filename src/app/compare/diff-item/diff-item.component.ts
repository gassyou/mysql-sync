import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diff-item',
  templateUrl: './diff-item.component.html',
  styleUrls: ['./diff-item.component.less']
})
export class DiffItemComponent implements OnInit {

  showDetail=false;

  diffItems = [{name1:'sys_user',name2:'sys_user'}, {name1:'sys_function',name2:'sys_function'}, {name1:'mst_user_role',name2:'mst_user_role'}];
  detailItems = [{name1:'id',name2:'id'}, {name1:'name',name2:'name'}, {name1:'gmt_create',name2:'gmt_create'}];

  constructor() { }

  ngOnInit() {
  }

}
