import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DiffItemViewModel, DiffType } from './diff-item-view-model';
import { DomainEvent } from './../../common/domain-event';
import { CompareService } from './../../service/compare.service';
import { IDifference } from './../../mySql/difference-interface';
import { Table } from './../../mySql/table';
import { TableColumn } from './../../mySql/table-column';
import { TableKey } from './../../mySql/table-key';
import { TableView } from './../../mySql/table-view';

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

      if(!e) {
        return ;
      }

      const diffItem: DiffItemViewModel = {
        id: this.getDiffItemIds(e),
        type: this.getDiffItemType(e),
        title_1: e.left?e.left.name : '<不存在>',
        title_2: e.right?e.right.name : '<不存在>',
        sql1: e.syncToLeftSql(),
        sql2: e.syncToRightSql(),
        isSelected: false,
        styleClass: 'mouseout',
        items: []
      };

      if(!diffItem.id) {
        return;
      }

      const ids: string[] = diffItem.id.split('-');
      if(ids.length > 1) {
        this.diffItems.forEach( x=> {
          if(x.id === ids[0]) {
            x.items.push(diffItem);
          }
        });
      } else {
        this.diffItems.push(diffItem);
      }
    }

    DomainEvent.getInstance().Register({eventType:'diff-found', handle:showDiff});

    DomainEvent.getInstance().Register({eventType:'progress', handle:(e: number)=>{
      if(!e) {
        return ;
      }
      this.percent = Number.parseFloat(e.toFixed(2));
      this.cdr.detectChanges();
    }})
    this.compare.doComparetion();
  }

  onItemClick(diff: DiffItemViewModel) {
    this.selectedId = diff.id;
    this.compare.diffItemSelected$.next(
      {
        sql1: diff.sql1,
        sql2: diff.sql2
      }
    );
  }

  getDiffItemIds(data: IDifference): string {
    const diffType = this.getDiffItemType(data);
    if(diffType !== DiffType.COLUMN && diffType !== DiffType.KEY) {
      return this.diffItems.length.toString();
    } else {
      const parentName = this.getBelongedTableName(data);
      let parent = this.diffItems.find(x=>{
        const name = x.title_1 !== '<不存在>'? x.title_1 : x.title_2;
        return name === parentName;
      });

      if(!parent) {
        parent = this.createParentDiffItem(parentName);
      }
      return parent.id.toString() + '-' + parent.items.length.toString();
    }
  }

  getDiffItemType(data: IDifference): DiffType {

    const comparable = data.left ? data.left: data.left;

    if(comparable instanceof Table) {
      return DiffType.TABLE;
    } else if(comparable instanceof TableColumn) {
      return DiffType.COLUMN;
    } else if(comparable instanceof TableKey) {
      return DiffType.KEY;
    } else if(comparable instanceof TableView) {
      return DiffType.VIEW;
    } else  {
      return DiffType.FUNC;
    }
  }

  getBelongedTableName(data:IDifference): string {
    const comparable = data.left ? data.left: data.left;
    return comparable.tableName;
  }

  createParentDiffItem(tableName: string): DiffItemViewModel {
    return {
      id: this.diffItems.length.toString(),
      type: DiffType.TABLE,
      title_1: tableName,
      title_2: tableName,
      sql1: '',
      sql2: '',
      isSelected: false,
      styleClass: 'mouseout',
      items: []
    };
  }




}
