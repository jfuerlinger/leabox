import { Request, Response } from 'express';
const commandLineArgs = require('command-line-args');
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


// const dao: ActionDao = new MongoDbActionDao();
// dao
//     .getAllActions()
//     .then((actions) => {
//         console.log(actions);
//     })
//     .catch((err) => console.log(err));

const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid').v4;



const optionDefinitions = [
    { name: 'rfidcontroller', alias: 'r', type: Boolean },
    { name: 'player', alias: 'p', type: Boolean },
];


const options = commandLineArgs(optionDefinitions);

if (options.rfidcontroller === true) {

    let topicCreds = new msRestAzure.TopicCredentials('anWAk0fYFwgaDG/tL0kHlDWQHZhzXs3P2fn12e2mFdc=');
    let EGClient = new EventGridClient(topicCreds);
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

} else if (options.player === true) {
    const leaBoxController = new LeaBoxController();
    leaBoxController.init();
    leaBoxController.start();
} else {
    const message = 'App was started without mode info!';
    logger.error(message);
    new Error(message);
}



