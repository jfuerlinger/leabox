import { DbActionResolver } from './db-action-resolver';
import { ActionResolver } from './action-resolver';
import { AudioPlayer } from './audio-player';
import { YoutubeAudioPlayer } from './youtube-audio-player';
import { Action } from '../model/action';

import clear from 'clear';
import { default as chalk } from 'chalk';
import { CommandProcessor } from './command-processing/command-processor';
import { CliCommandProcessor } from './command-processing/cli-command-processor';
import { WebApiCommandProcessor } from './command-processing/webapi-command-processor';
import { RfidCommandProcessor } from './command-processing/rfid-command-processor';

const log = console.log;

export class LeaBoxController {

    private _actionResolver: ActionResolver;
    private _player: AudioPlayer;

    private _commandProcessors: CommandProcessor[] = [
        // new CliCommandProcessor(this),
        // new WebApiCommandProcessor(this),
        new RfidCommandProcessor(this)
    ];

    constructor() {
        this._actionResolver = new DbActionResolver();
        this._player = new YoutubeAudioPlayer();
    }

    init() {

        clear();

        log(chalk.magentaBright('+---------------------+'));
        log(chalk.magentaBright('|      Lea\'s box      |'));
        log(chalk.magentaBright('+---------------------+'));

        log(chalk.yellowBright('Press <strg>-<c> to exit ...'));

        this._commandProcessors.forEach((processor: CommandProcessor) => {
            processor.init();
        });
    }

    start() {
        this._commandProcessors.forEach((processor: CommandProcessor) => {
            processor.start();
        });
    }

    processId(id: string): void {
        const action: Action = this._actionResolver.getActionById(id);
        debugger;
        if (action) { }
        switch (action.type) {
            case 'youtube':
                if (action.url != null) {
                    this._player.play(action.url);
                }
                break;
        }
    }

    playFromYoutube(url: string) {

    }

    playFromAzureBlobStorage(uri: string) {

    }

    stop() {
        this._player.stop();
    }
}