import { Action } from "../model/action";

export interface ActionResolver {
    getActionById(id: string): Action;
}