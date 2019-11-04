import { Action } from "../../model/action";

export interface ActionDao {
    getAllActions(): Promise<Action[]>
    getActionById(id: string): Promise<Action>;
    updateTimestampOnAction(id: string): void;
    addAction(action: Action): void;
    
}
