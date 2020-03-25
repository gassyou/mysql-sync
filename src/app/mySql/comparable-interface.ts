export interface IComparable {
  name: string;
  tableName?: string;
  toDDLString(): string;
  findDiff(other: IComparable): boolean;
}
