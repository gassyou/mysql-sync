export interface IComparable {
  toDDLString(): string;
  findDiff(other: IComparable): boolean;
}
