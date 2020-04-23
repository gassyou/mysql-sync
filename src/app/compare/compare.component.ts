import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompareComponent implements OnInit {

  host1 = '';
  name1 = '';

  host2 = '';
  name2 = '';

  leftSql = '';
  rightSql = '';

  constructor(
    public compare: CompareService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.host1 = this.compare.leftConnCofing.host;
    this.name1 = this.compare.leftConnCofing.database;

    this.host2 = this.compare.rightConnCofing.host;
    this.name2 = this.compare.rightConnCofing.database;

    this.compare.diffItemSelected$.asObservable().subscribe(
      data => {

        this.leftSql = data.left;
        this.rightSql = data.right;
        this.cdr.detectChanges();
      }
    );
  }

  exit() {
    this.compare.exit();
    this.router.navigate(['connection']);
  }

  copy(val:string) {

    if(val) {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.message.info("拷贝成功！");
    } else {
      this.message.warning("没有内容被拷贝！");
    }
  }

}
