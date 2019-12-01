import { IDifference } from './difference-interface';
import { TableColumn } from './table-column';

export class DiffOfTableColumn implements IDifference {
  left: TableColumn;
  right: TableColumn;


  syncToLeftSql(): string {
    let returnValue = '';

    if (this.left !== null) {
      if (this.right === null) {
        returnValue = `alter table ${this.left.tableName} drop column ${this.left.columnName}`;
      } else {
        returnValue = `alter table ${this.right.tableName} modify column ${this.right.toDDLString()}`;
      }
    } else {
      if (this.right !== null) {
        returnValue = `alter table ${this.right.tableName} add column ${this.right.toDDLString()}`;
      }
    }

    return returnValue.toUpperCase();
  }
  syncToRightSql(): string {
    let returnValue = '';


    if (this.right !== null) {
      if (this.left === null) {
        returnValue = `alter table ${this.right.tableName} drop column ${this.right.columnName}`;
      } else {
        returnValue = `alter table ${this.left.tableName} modify column ${this.left.toDDLString()}`;
      }
    } else {
      if (this.left !== null) {
        returnValue = `alter table ${this.left.tableName} add column ${this.left.toDDLString()}`;
      }
    }

    return returnValue.toUpperCase();

  }


}
