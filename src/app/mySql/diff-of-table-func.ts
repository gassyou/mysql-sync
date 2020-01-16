import { IDifference } from './difference-interface';
import { TableFunction } from './table-func';

export class DiffOfTableFunc implements IDifference {
  left: TableFunction;
  right: TableFunction;

  syncToLeftSql(): string {
    let returnValue = '';
    if (this.left !== null) {
      returnValue = `drop ${this.left.funcType} ${this.left.funcName}<br/>`;
    }

    if (this.right !== null) {
      returnValue = returnValue + this.right.toDDLString();
    }

    return returnValue.toUpperCase();
  }

  syncToRightSql(): string {
    let returnValue = '';
    if (this.right !== null) {
      returnValue = `drop ${this.right.funcType} ${this.right.funcName}<br/>`;
    }

    if (this.left !== null) {
      returnValue = returnValue + this.left.toDDLString();
    }

    return returnValue.toUpperCase();
  }
}
