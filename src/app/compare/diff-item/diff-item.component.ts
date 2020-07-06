import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DiffItemViewModel } from './diff-item-view-model';
import { DomainEvent } from './../../common/domain-event';
import { CompareService } from './../../service/compare.service';
import { IDifference, DiffType } from './../../mySql/difference-interface';


@Component({
  selector: 'app-diff-item',
  templateUrl: './diff-item.component.html',
  styleUrls: ['./diff-item.component.less']
})
export class DiffItemComponent implements OnInit {

  selectedId = '';
  diffItems: DiffItemViewModel[] = [];
  percent: number = 0;

  constructor(
    public compare: CompareService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    const showDiff = (e: IDifference) => {

      if(!e || this.checkIsExisting(e)) {
        return ;
      }

      const diffItem: DiffItemViewModel = {
        id: this.getDiffItemIds(e),
        diff: e,
        isSelected: false,
        styleClass: 'mouseout',
        items: []
      };

      if(e.type !== DiffType.COLUMN && e.type !== DiffType.KEY) {
        this.diffItems.push(diffItem);
      }  else {
        this.diffItems.some(x=>{
          if(x.diff.name === e.tableName) {
            x.items.push(diffItem);
            return true;
          }
        });
      }
      this.cdr.markForCheck();
    }

    const showProgress = (e: number) => {
      if(!e) {
        return ;
      }
      this.percent = Number.parseFloat(e.toFixed(2));

      if (!this.cdr['destroyed']) {
        this.cdr.detectChanges();
      }
    }

    DomainEvent.getInstance().Register({eventType: 'diff-found', handle: showDiff});
    DomainEvent.getInstance().Register({eventType: 'progress', handle: showProgress});
    this.compare.doComparetion();
  }

  redo() {
    this.diffItems = [];
    this.compare.doComparetion();
  }

  compareKey() {
    this.diffItems=[];
    this.compare.keyCompareOnly = true;
    this.compare.doComparetion();
  }

  compareFunction() {
    this.diffItems=[];
    this.compare.functionCompareOnly = true;
    this.compare.doComparetion();
  }

  compareView() {
    this.diffItems = [];
    this.compare.viewCompareOnly = true;
    this.compare.doComparetion();
  }

  onItemClick(diff: DiffItemViewModel) {
    this.selectedId = diff.id;
    this.diffItems.forEach(x => {
      if(x.id === diff.id) {
        x.isSelected = !x.isSelected
      }
    });

    this.compare.diffItemSelected$.next(
      {
        left: diff.diff.syncToLeftSql(),
        right: diff.diff.syncToRightSql()
      }
    );

    this.cdr.detectChanges();
  }

  getDiffItemIds(data: IDifference): string {

    if(data.type !== DiffType.COLUMN && data.type !== DiffType.KEY) {
      return this.diffItems.length.toString();
    }
    const parent = this.diffItems.find(x=>{
      return x.diff.name === data.tableName
    });
    return parent.id + '-' + parent.items.length.toString();
  }

  checkIsExisting(data: IDifference): boolean {

    let some: DiffItemViewModel = null;
    if(data.type !== DiffType.COLUMN && data.type !== DiffType.KEY) {
      some = this.diffItems.find(x=>{
        return (x.diff.name === data.name && x.diff.type === data.type)
      });
    } else {

      const parent = this.diffItems.find(x=>{
        return x.diff.name === data.tableName
      });

      if(parent) {
        some = parent.items.find(x=>{
          return (x.diff.name === data.name && x.diff.type === data.type)
        });
      }
    }

    if(some) {
      return true;
    } else {
      return false;
    }
  }

}
