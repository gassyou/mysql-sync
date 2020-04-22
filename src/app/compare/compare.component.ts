import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { Router } from '@angular/router';

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
    private cdr: ChangeDetectorRef
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

}
