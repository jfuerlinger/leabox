import { ActionResolver } from './action-resolver';
import { Action } from '../model/action';

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const logger = require('./logger');

export class DbActionResolver implements ActionResolver {

    constructor() {
        // Set some defaults (required if your JSON file is empty)
        db.defaults({
            actions: [
                {
                    id: 'JqvuOLi_',
                    action: 'youtube',
                    url: 'https://www.youtube.com/watch?v=BYM3Pr3_Ov8'
                },
                {
                    id: '2',
                    action: 'youtube',
                    url: 'https://www.youtube.com/watch?v=Ax7OkxiEmuY'
                },
                {
                    id: '3',
                    action: 'youtube',
                    url: 'https://www.youtube.com/watch?v=YWWKakbIkW0'
                }
            ],
        })
            .write();
    }

    getActionById(id: string): Action {
        logger.info(`resolving action with id '${id}' ...`);
        return db.get('actions')
            .filter({ id: id })
            .first()
            .value();
    }
}