import { IDifference } from "../../mySql/difference-interface";

export interface DiffItemViewModel {
  id: string;
  isSelected: boolean;
  items: DiffItemViewModel[];
  diff: IDifference;
  isLeaf: boolean;
  isItemsVisible: boolean;
}
