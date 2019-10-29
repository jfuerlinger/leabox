import { CommandProcessor } from './command-processor';
import { LeaBoxController } from '../leabox-controller';
import { RfidController } from '../rfid-controller';
import { distinctUntilChanged, skip } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
const logger = require('../logger');

const appInsights = require('applicationinsights');
const appInsightsClient = new appInsights.TelemetryClient();

export class RfidCommandProcessor implements CommandProcessor {

    private _isProcessing: boolean;
    private _rfidController;

    constructor(private _leaBoxController: LeaBoxController) {
        this._isProcessing = false;
        this._rfidController = new RfidController();
    }

    init(): void {

        const processor: RfidCommandProcessor = this;

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
}