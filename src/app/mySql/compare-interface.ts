export interface ICompare {
  toDDLString(): string;
  compare(other: ICompare): boolean;
}
