import { Request, Response } from 'express';

import { LeaBoxController } from './core/leabox-controller';
import { MongoDbActionDao } from './core/persistence/mongo-db-action-dao';
import { ActionDao } from './core/persistence/action-dao';
const logger = require('./core/logger');
const appInsights = require('applicationinsights');

appInsights.setup()
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();
// let client = appInsights.defaultClient;
logger.info('Application Insights configured');

// const leaBoxController = new LeaBoxController();
// leaBoxController.init();
// leaBoxController.start();

// const dao: ActionDao = new MongoDbActionDao();
// dao
//     .getAllActions()
//     .then((actions) => {
//         console.log(actions);
//     })
//     .catch((err) => console.log(err));

debugger;
const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid').v4;

let topicCreds = new msRestAzure.TopicCredentials('anWAk0fYFwgaDG/tL0kHlDWQHZhzXs3P2fn12e2mFdc=');
let EGClient = new EventGridClient(topicCreds, /*'01964263-bc84-4b67-b94a-2a65733186ef'*/);
let topicHostName = 'leabox.westeurope-1.eventgrid.azure.net';
let events = [
    {
        id: uuid(),
        subject: 'TestSubject',
        dataVersion: '1.0',
        eventTime: new Date(),
        eventType: 'JFuerlinger.leabox.testevent',
        data: {
            field1: 'value1',
            filed2: 'value2'
        }
    }
];

EGClient.publishEvents(topicHostName, events)
    .then(
        (result) => {
            return Promise.resolve(console.log('Published events successfully.'));
        }).catch((err) => {
            console.log('An error ocurred');
            console.dir(err, { depth: null, colors: true });
        });