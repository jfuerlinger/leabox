import { Request, Response } from 'express';
const commandLineArgs = require('command-line-args');
import { LeaBoxController } from './core/leabox-controller';
import { MongoDbActionDao } from './core/persistence/mongo-db-action-dao';
import { ActionDao } from './core/persistence/action-dao';
import { RfidController } from './core/rfid-controller';
import { RfidCommandProcessor } from './core/command-processing/rfid-command-processor';
import { distinctUntilChanged, skip } from 'rxjs/operators';
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
const appInsightsClient = appInsights.defaultClient;
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
    startRfidController();
} else if (options.player === true) {
    startLeaBoxController();
} else {
    const message = 'App was started without mode info!';
    logger.error(message);
    new Error(message);
}

function startLeaBoxController() {
    const leaBoxController = new LeaBoxController();
    leaBoxController.init();
    leaBoxController.start();

    appInsightsClient.trackEvent({ name: 'player:started', properties: {} });
}

function startRfidController() {
    let topicCreds = new msRestAzure.TopicCredentials('anWAk0fYFwgaDG/tL0kHlDWQHZhzXs3P2fn12e2mFdc=');
    let EGClient = new EventGridClient(topicCreds);
    let topicHostName = 'leabox.westeurope-1.eventgrid.azure.net';

    function pushRfidInfo(id: string) {

        const events = [
            {
                id: uuid(),
                subject: 'leabox:rfid',
                dataVersion: '1.0',
                eventTime: new Date(),
                eventType: 'JFuerlinger.leabox.rfid:tagrecognized',
                data: {
                    id: id,
                }
            }
        ];

        return EGClient.publishEvents(topicHostName, events);
    }

    const rfidController = new RfidController();
    rfidController
        .getObservable()
        .pipe(
            distinctUntilChanged() // only pass changes
            , skip(1) // skip first emit because its the info, that there was no rfid chip found
        ).subscribe({
            next(id) {
                pushRfidInfo(id)
                    .then(
                        (result) => {
                            return Promise.resolve(console.log('Published rfid info successfully.'));
                        }).catch((err) => {
                            console.log('An error ocurred');
                            console.dir(err, { depth: null, colors: true });
                        });
            },
            error(err) { logger.error('something wrong occurred: ' + err); },
            complete() { logger.info('done'); }
        });

    appInsightsClient.trackEvent({ name: 'rfidcontroller:started', properties: {} });
}

