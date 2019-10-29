import { Request, Response } from 'express';

import { LeaBoxController } from './core/leabox-controller';
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

const leaBoxController = new LeaBoxController();
leaBoxController.init();
leaBoxController.start();
