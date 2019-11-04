

const http = require('http');
const cors = require('cors');
const express = require('express');
import { default as chalk } from 'chalk';

import { Request, Response } from 'express';
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


const expressApp = express();
expressApp.use(cors()); // give access to all clients
expressApp.use(express.json());

expressApp.get('/api/discover/:id', (req: Request, res: Response) => {
    const id: string = req.params.id;
    logger.info(`/api/discover/${id} was called`);


    appInsightsClient.trackEvent({ name: 'leabox-api:discover', properties: { id: id, request: req } });
    pushRfidInfo(id);

    res
        .status(200)
        .send('ok');
});
expressApp.get('/api/stop', (req: Request, res: Response) => {

    logger.info(`/api/stop was called`);

    appInsightsClient.trackEvent({ name: 'leabox-api:stop-command', properties: { request: req } });

    res
        .status(200)
        .send('ok');
});

const port: number = process.env.PORT || 3000;
expressApp.listen(port);
console.log(chalk.green(`Server listening on port '${port}' ...`));

appInsightsClient.trackEvent({ name: 'leabox-api:started', properties: {} });
