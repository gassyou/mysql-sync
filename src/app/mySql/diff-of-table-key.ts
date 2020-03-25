import { IDifference } from './difference-interface';
import { TableKey } from './table-key';
import { TableKeyType } from './table-key-type';
import { String } from 'typescript-string-operations';


export class DiffOfTableKey implements IDifference {

  public readonly left: TableKey;
  public readonly right: TableKey;

  private DROP_PRIMARY_KEY = `ALTER TABLE {0} DROP ${TableKeyType.PRIMARY_KEY}`;
  private DROP_FOREIGN_KEY = `ALTER TABLE {0} DROP ${TableKeyType.FOREIGN_KEY} {1}`;
  private DROP_KEY = `ALTER TABLE {0} DROP INDEX {1}`;

  private ADD_KEY = `ALTER TABLE {0} ADD {1}`;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  syncToLeftSql(): string {

    let returnValue = '';
    if (this.left) {
      if (this.left.keyType === TableKeyType.PRIMARY_KEY) {
        returnValue = String.Format(this.DROP_PRIMARY_KEY, this.left.tableName) + '<br/>';
      } else if (this.left.keyType === TableKeyType.FOREIGN_KEY) {
        returnValue = String.Format(this.DROP_FOREIGN_KEY, this.left.tableName, this.left.name) + '<br/>';
      } else {
        returnValue = String.Format(this.DROP_KEY, this.left.tableName, this.left.name) + '<br/>';
      }
    }

    if (this.right) {
      returnValue = returnValue + String.Format(this.ADD_KEY, this.right.tableName, this.right.toDDLString());
    }

    return returnValue.toUpperCase();

  }

  syncToRightSql(): string {

    let returnValue = '';
    if (this.right ) {
      if (this.right.keyType === TableKeyType.PRIMARY_KEY) {
        returnValue = String.Format(this.DROP_PRIMARY_KEY, this.right.tableName) + '<br/>';
      } else if (this.right.keyType === TableKeyType.FOREIGN_KEY) {
        returnValue = String.Format(this.DROP_FOREIGN_KEY, this.right.tableName, this.right.name) + '<br/>';
      } else {
        returnValue = String.Format(this.DROP_KEY, this.right.tableName, this.right.name) + '<br/>';
      }
    }

    if (this.left) {
      returnValue = returnValue + String.Format(this.ADD_KEY, this.left.tableName, this.left.toDDLString());
    }

    return returnValue.toUpperCase();

  }

}
