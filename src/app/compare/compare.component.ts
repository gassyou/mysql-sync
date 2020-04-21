import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompareService } from '../service/compare.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.less']
})
export class CompareComponent implements OnInit {

  host1 = '';
  name1 = '';

  host2 = '';
  name2 = '';

  isSpinning = false;

  sqlDiff:any = {};

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
        this.sqlDiff = data;
        this.cdr.markForCheck();
      }
    );

  }


  exit() {
    this.compare.exit();
    this.router.navigate(['connection']);
  }

}
