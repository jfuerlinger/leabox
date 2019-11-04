import { ActionDao } from "./action-dao";
import { Action } from "../../model/action";
import { MongoDbFactory } from "./mongo-db-factory";

export class MongoDbActionDao implements ActionDao {

    private _db: any;

    private getDb(): any {
        if (!this._db) {
            debugger;
            this._db = MongoDbFactory.GetDbConnection();
        }

        return this._db;
    }

    getAllActions(): Promise<Action[]> {
        return new Promise<Action[]>((resolve, reject) => {
            debugger;
            
            var cursor = this.getDb().collection('actions').find();

            const actions: Array<Action> = [];

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }
                if (doc != null) {
                    actions.push(doc);
                }
            });

            resolve(actions);
        });
    }

    getActionById(id: string): Promise < Action > {
            throw new Error("Method not implemented.");
        }

    updateTimestampOnAction(id: string): void {
            throw new Error("Method not implemented.");
        }
    addAction(action: Action) {
            throw new Error("Method not implemented.");
        }


}