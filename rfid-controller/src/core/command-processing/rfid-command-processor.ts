import { CommandProcessor } from './command-processor';
import { LeaBoxController } from '../leabox-controller';
import { RfidController } from '../rfid-controller';
const logger = require('../logger');

import path from 'path';
import { distinctUntilChanged, skip } from 'rxjs/operators';

const appInsights = require('applicationinsights');
const appInsightsClient = new appInsights.TelemetryClient();

// const { Worker } = require('worker_threads');

// type WorkerCallback = (err: any, result?: any) => any;

export class RfidCommandProcessor implements CommandProcessor {

    private _isProcessing: boolean;
    private _rfidController: RfidController;

    constructor(private _leaBoxController: LeaBoxController) {
        this._isProcessing = false;
        this._rfidController = new RfidController();
    }

    init(): void {

        const processor: RfidCommandProcessor = this;

        // const worker = this.runWorker(path.join(__dirname, 'worker.js'), (err, { value }) => {
        //     if (err) {
        //         logger.warn('Error from RfidThreadWorker: ' + err);
        //         return null;
        //     }

        //     processor.handleCommand(value);
        //     return null;
        // });

        // worker.postMessage({});

        this._rfidController
            .getObservable()
            .pipe(
                distinctUntilChanged() // only pass changes
                , skip(1) // skip first emit because its the info, that there was no rfid chip found
            ).subscribe({
                next(id) {
                    processor.handleCommand(id);
                },
                error(err) { logger.error('something wrong occurred: ' + err); },
                complete() { logger.info('done'); }
            });
    }

    private handleCommand(id) {
        if (this._isProcessing === true) {
            appInsightsClient.trackEvent({ name: 'rfid:tag-recognized', properties: { id: id } });
            logger.info(`got id '${id}'`);
            switch (id) {
                case RfidController.EMPTY_TAG:
                    this._leaBoxController.stop();
                    break;

                default:
                    this._leaBoxController.processId(id);
                    break;
            }
        }
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

    // private runWorker(path: string, cb: WorkerCallback, workerData: object | null = null) {

    //     const worker = new Worker(path, { payload: 'xyz' });
    //     worker.on('message', cb.bind(null, null));
    //     worker.on('error', cb);
    //     worker.on('exit', (exitCode) => {
    //         if (exitCode === 0) {
    //             return null;
    //         }
    //         return cb(new Error(`Worker has stopped with code ${exitCode}`));
    //     });
    //     return worker;
    // }
}