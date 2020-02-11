import { Component, OnInit } from '@angular/core';
import { DiffItemViewModel } from './diff-item-view-model';

@Component({
  selector: 'app-diff-item',
  templateUrl: './diff-item.component.html',
  styleUrls: ['./diff-item.component.less']
})
export class DiffItemComponent implements OnInit {

  selectedId='';

  diffItems: DiffItemViewModel[] = [
    {
      id: '1',
      title_1: 'mst_sys_user',
      title_2: 'mst_sys_user',
      styleClass: 'mouseout',
      isSelected: false,
      items:[
        {
          id: '1-1',
          title_1: 'id',
          title_2: 'id',
          styleClass: 'mouseout',
          isSelected: false,
        },
        {
          id: '1-2',
          title_1: 'name',
          title_2: 'name',
          styleClass: 'mouseout',
          isSelected: false,
        },
        {
          id: '1-3',
          title_1: 'enterDay',
          title_2: 'enterDay',
          styleClass: 'mouseout',
          isSelected: false,
        }
      ]
    },
    {
      id: '2',
      title_1: 'mst_sys_config',
      title_2: 'mst_sys_config',
      styleClass: 'mouseout',
      isSelected: false,
      items:[
        {
          id: '2-1',
          title_1: 'id',
          title_2: 'id',
          styleClass: 'mouseout',
          isSelected: false,
        },
        {
          id: '2-2',
          title_1: 'name',
          title_2: 'name',
          styleClass: 'mouseout',
          isSelected: false,
        },
        {
          id: '2-3',
          title_1: 'enterDay',
          title_2: 'enterDay',
          styleClass: 'mouseout',
          isSelected: false,
        }
      ]
    },
    {
      id: '3',
      title_1: 'mst_sys_setting',
      title_2: 'mst_sys_setting',
      styleClass: 'mouseout',
      isSelected: false,
    }

  ];

  constructor() { }

  ngOnInit() {
  }

  onItemClick(id) {
    this.selectedId = id;
  }



}
