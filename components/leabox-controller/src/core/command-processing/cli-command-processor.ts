import { CommandProcessor } from './command-processor';
import { LeaBoxController } from '../leabox-controller';
const logger = require('../logger');


const process = require('process');
const readline = require('readline');


export class CliCommandProcessor implements CommandProcessor {

    private _isProcessing: boolean;

    constructor(private _leaBoxController: LeaBoxController) {
        this._isProcessing = false;
    }

    init(): void {
        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.setRawMode) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', (str, key) => {

            if (this._isProcessing === true) {

                if (key.ctrl && key.name === 'c') {
                    process.exit(); // eslint-disable-line no-process-exit
                } else if (key.ctrl && key.name === 'x') {
                    logger.info('CliController: stop-action was requested');
                    this._leaBoxController.stop();
                } else {
                    logger.info(`"${str}" key pressed`);
                    this._leaBoxController.processId(key.name);
                }
            }
        });
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