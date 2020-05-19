import { IDifference, DiffType } from './difference-interface';
import { TableKey } from './table-key';
import { TableKeyType } from './table-key-type';
import { String } from 'typescript-string-operations';


export class DiffOfTableKey implements IDifference {

  public readonly name?: string;
  public readonly tableName?: string;
  public readonly type?: DiffType;
  public readonly left: TableKey;
  public readonly right: TableKey;

  private DROP_PRIMARY_KEY = `ALTER TABLE {0} DROP ${TableKeyType.PRIMARY_KEY};<br/>`;
  private DROP_FOREIGN_KEY = `ALTER TABLE {0} DROP ${TableKeyType.FOREIGN_KEY} {1};<br/>`;
  private DROP_KEY = `ALTER TABLE {0} DROP INDEX {1};<br/>`;

  private ADD_KEY = `ALTER TABLE {0} ADD {1};<br/>`;

  public constructor(val = {}) {
    Object.assign(this, val);

    this.name = this.left? this.left.name:this.right.name;
    this.tableName = this.left? this.left.tableName:this.right.tableName;
    this.type = DiffType.KEY;
  }

  syncToLeftSql(): string {

    let returnValue = '';
    if (this.left) {
      if (this.left.keyType === TableKeyType.PRIMARY_KEY) {
        returnValue = String.Format(this.DROP_PRIMARY_KEY, this.left.tableName);
      } else if (this.left.keyType === TableKeyType.FOREIGN_KEY) {
        returnValue = String.Format(this.DROP_FOREIGN_KEY, this.left.tableName, this.left.name);
      } else {
        returnValue = String.Format(this.DROP_KEY, this.left.tableName, this.left.name);
      }
    }

    if (this.right) {
      returnValue = returnValue + String.Format(this.ADD_KEY, this.right.tableName, this.right.toDDLString());
    }

    return returnValue;

  }

  syncToRightSql(): string {

    let returnValue = '';
    if (this.right ) {
      if (this.right.keyType === TableKeyType.PRIMARY_KEY) {
        returnValue = String.Format(this.DROP_PRIMARY_KEY, this.right.tableName);
      } else if (this.right.keyType === TableKeyType.FOREIGN_KEY) {
        returnValue = String.Format(this.DROP_FOREIGN_KEY, this.right.tableName, this.right.name);
      } else {
        returnValue = String.Format(this.DROP_KEY, this.right.tableName, this.right.name);
      }
    }

    if (this.left) {
      returnValue = returnValue + String.Format(this.ADD_KEY, this.left.tableName, this.left.toDDLString());
    }

    return returnValue;

  }

}
