import { Component, OnInit } from '@angular/core';
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

  constructor(
    public compare: CompareService,
    private router: Router
  ) { }


  ngOnInit() {
  }


  exit() {
    this.compare.exit();
    this.router.navigate(['connection']);
  }

}
