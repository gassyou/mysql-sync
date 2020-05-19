import { IDifference, DiffType } from './difference-interface';
import { TableColumn } from './table-column';

export class DiffOfTableColumn implements IDifference {

  public readonly name?: string;
  public readonly tableName?: string;
  public readonly type?: DiffType;
  left: TableColumn;
  right: TableColumn;

  public constructor(val = {}) {
    Object.assign(this, val);
    this.name = this.left? this.left.name:this.right.name;
    this.tableName = this.left? this.left.tableName:this.right.tableName;
    this.type = DiffType.COLUMN;
  }


  syncToLeftSql(): string {
    let returnValue = '';

    if (this.left) {
      if (!this.right) {
        returnValue = `alter table ${this.left.tableName} drop column ${this.left.name}`;
      } else {
        returnValue = `alter table ${this.right.tableName} modify column ${this.right.toDDLString()}`;
      }
    } else {
      if (this.right) {
        returnValue = `alter table ${this.right.tableName} add column ${this.right.toDDLString()}`;
      }
    }

    return returnValue;
  }
  syncToRightSql(): string {
    let returnValue = '';


    if (this.right) {
      if (!this.left) {
        returnValue = `alter table ${this.right.tableName} drop column ${this.right.name}`;
      } else {
        returnValue = `alter table ${this.left.tableName} modify column ${this.left.toDDLString()}`;
      }
    } else {
      if (this.left) {
        returnValue = `alter table ${this.left.tableName} add column ${this.left.toDDLString()}`;
      }
    }

    return returnValue;

  }


}
