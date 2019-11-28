export class TableFunction {

  public readonly funcName: string;
  public readonly funcType: string;
  public readonly funcBody: string;

  public constructor(val = {}) {
    Object.assign(this, val);
  }

  public compare(other: TableFunction): boolean {
    return this.funcBody.toLowerCase() === other.funcBody.toLowerCase();
  }

}
