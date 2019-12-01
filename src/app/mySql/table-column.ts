import { IComparable } from './comparable-interface';
import { DomainEvent } from '../common/domain-event';
import { runInThisContext } from 'vm';

export class TableColumn implements IComparable {

  public readonly tableName: string;
  public readonly columnName: string;
  public readonly dataType: string;
  public readonly nullable: boolean;
  public readonly autoIncrement: boolean;
  public readonly defaultValue: string;
  public readonly extra: string;
  public readonly comment: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  public toDDLString(): string {
    return '`' + this.columnName + '` '
      + this.dataType + ' '
      + this.nullable ? '' : 'NOT' + ' '
      + this.autoIncrement ? 'AUTO_INCREMENT' : '' + ' '
      + this.defaultValue ? 'DEFAULT ' + '\'' + this.defaultValue + '\'' : '' + ' '
      + this.comment ? 'COMMENT' +  '\'' + this.comment + '\'' : '';
  }


  public findDiff(other: TableColumn): boolean {

    if (other === null) {
      DomainEvent.getInstance().raise({left: this, right: other});
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      DomainEvent.getInstance().raise({left: this, right: other});
      return true;
    }
    return false;
  }


}
