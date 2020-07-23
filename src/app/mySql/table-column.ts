import { IComparable } from './comparable-interface';

export class TableColumn implements IComparable {

  public readonly name: string;
  public readonly tableName: string;
  public readonly dataType: string;
  public readonly nullable: boolean;
  public readonly autoIncrement: boolean;
  public readonly defaultValue: any;
  public readonly extra: string;
  public readonly comment: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  public toDDLString(): string {
    return `\`${this.name}\`
            ${this.dataType}
            ${this.autoIncrement ? 'AUTO_INCREMENT' : ''}
            ${this.nullable ? 'NULL' : 'NOT NULL'}
            ${this.defaultValue ? 'DEFAULT \''+ this.defaultValue + '\'' : '' }
            ${this.comment ? 'COMMENT \'' + this.comment + '\'' : ''}`;
  }


  public findDiff(other: TableColumn): boolean {

    if (!other) {
      return true;
    } else if ( this.toDDLString().toUpperCase() !== other.toDDLString().toUpperCase()) {
      return true;
    }
    return false;
  }


}
