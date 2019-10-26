import { ActionResolver } from './action-resolver';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const logger = require(''./logger')

export class DbActionResolver implements ActionResolver {

    constructor() {
        // Set some defaults (required if your JSON file is empty)
        db.defaults({
            songs: [
                {
                    id: 'JqvuOLi_',
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
            // .find((value) => value.id === action)
            .filter({id: action})
            .value()
            .url;
    }

}