import { CommandProcessor } from './command-processor';
const http = require('http');
const cors = require('cors');
const express = require('express');
import { Request, Response } from 'express';
import { LeaBoxController } from '../leabox-controller';
import { default as chalk } from 'chalk';
const logger = require('../logger');


const appInsights = require('applicationinsights');
const appInsightsClient = new appInsights.TelemetryClient();

const log = console.log;

export class WebApiCommandProcessor implements CommandProcessor {

    private _isProcessing: boolean;

    private _port: number = 3000;
    private _expressApp: any;
    private _server: any;

    constructor(private _leaBoxController: LeaBoxController) {
        this._isProcessing = false;
    }

    init(): void {
        this._expressApp = express();
        this._expressApp.use(cors()); // give access to all clients
        this._expressApp.use(express.json());

        this._expressApp.get('/api/discover/:id', (req: Request, res: Response) => {
            const id: string = req.params.id;
            logger.info(`/api/discover/${id} was called`);

            if (this._isProcessing === true) {

                appInsightsClient.trackEvent({ name: 'webapi:play-command', properties: { id: id, request: req } });
                this._leaBoxController.processId(id);
            }

            res
                .status(200)
                .send('ok');
        });
        this._expressApp.get('/api/stop', (req: Request, res: Response) => {

            logger.info(`/api/stop was called`);

            if (this._isProcessing === true) {
                appInsightsClient.trackEvent({ name: 'webapi:stop-command', properties: { request: req } });
                this._leaBoxController.stop();
            }

            res
                .status(200)
                .send('ok');
        });

        this._expressApp.listen(this._port);
        log(chalk.green(`Server listening on port '${this._port}' ...`));
    }

    start(): void {
        this._isProcessing = true;
    }

    stop(): void {
        this._isProcessing = false;
    }

    isProcessing(): boolean {
        return this._isProcessing;
    }


}
