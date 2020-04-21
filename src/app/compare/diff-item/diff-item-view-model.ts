import { IDifference } from "../../mySql/difference-interface";

export interface DiffItemViewModel {
  id: string;
  styleClass: string;
  isSelected: boolean;
  items: DiffItemViewModel[];
  diff: IDifference;
}
