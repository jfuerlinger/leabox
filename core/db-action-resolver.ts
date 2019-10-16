import { ActionResolver } from "./action-resolver";

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)


export class DbActionResolver implements ActionResolver {

    constructor() {
        // Set some defaults (required if your JSON file is empty)
        db.defaults({
            songs: [
                {
                    id: '1',
                    url: 'https://www.youtube.com/watch?v=BYM3Pr3_Ov8'
                },
                {
                    id: '2',
                    url: 'https://www.youtube.com/watch?v=Ax7OkxiEmuY'
                },
                {
                    id: '3',
                    url: 'https://www.youtube.com/watch?v=YWWKakbIkW0'
                }
            ],
        })
            .write();
    }

    getUrlForAction(action: string): string {
        return db.get('songs')
            .find((value) => value.id == action)
            .value()
            .url;
    }

}