export class TableColumn {

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


  public compare(other: TableColumn): boolean {
    return this.toDDLString().toUpperCase() === other.toDDLString().toUpperCase();
  }


}
