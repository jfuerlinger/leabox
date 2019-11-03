import { Settings } from "../settings";

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');


export class MongoDbFactory {
    static GetDbConnection(): any {
        const url = Settings.CONNECTIONSTRING_MONGODB;

        MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);
            return client.db('leabox');
        });
    }
}