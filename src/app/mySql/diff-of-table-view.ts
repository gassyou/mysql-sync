import { IDifference } from './difference-interface';
import { TableView } from './table-view';

export class DiffOfTableView implements IDifference {
  left: TableView;
  right: TableView;

  syncToLeftSql(): string {
    let returnValue = '';
    if (this.left !== null) {
      returnValue = `drop ${this.left.viewName}<br/>`;
    }

    if (this.right !== null) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.right !== null) {
      returnValue = `drop ${this.right.viewName}<br/>`;
    }

    if (this.left !== null) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue.toUpperCase();
  }
}
