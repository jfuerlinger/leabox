import { RfidController } from './core/rfid-controller';
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


const EventGridClient = require('azure-eventgrid');
const msRestAzure = require('ms-rest-azure');
const uuid = require('uuid').v4;

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

