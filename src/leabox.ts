const readline = require('readline');
const process = require('process');
const logger = require('./core/logger');

import { distinctUntilChanged, skip } from 'rxjs/operators';

import clear from 'clear';
import { default as chalk } from 'chalk';


const log = console.log;

import { AudioPlayer } from './core/audio-player';
import { YoutubeAudioPlayer } from './core/youtube-audio-player';
import { ActionResolver } from './core/action-resolver';
import { DbActionResolver } from './core/db-action-resolver';
import { RfidController } from './core/rfid-controller';


const player: AudioPlayer = new YoutubeAudioPlayer();
const actionResolver: ActionResolver = new DbActionResolver();

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
let client = appInsights.defaultClient;
logger.info('Application Insights configured');

clear();

readline.emitKeypressEvents(process.stdin);
if (process.stdin.setRawMode) {
    process.stdin.setRawMode(true);
}


process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit(); // eslint-disable-line no-process-exit
    } else if (key.ctrl && key.name === 'x') {
        logger.info('TODO: stoping ...');
    } else {
        log(chalk.yellowBright(`"${str}" key pressed`));
        const url = actionResolver.getUrlForAction(key.name);
        log(chalk.green(url));
        if (url != null) {
            log(chalk.green(`Playing file '${url}' ...`));
            player.play(url);
        }
    }
});

log(chalk.magentaBright('+---------------------+'));
log(chalk.magentaBright('|      Lea\'s box      |'));
log(chalk.magentaBright('+---------------------+'));

log(chalk.yellowBright('Press <strg>-<c> to exit ...'));

const rfidController = new RfidController();
rfidController
    .getObservable()
    .pipe(
        distinctUntilChanged() // only pass changes
        , skip(1) // skip first emit because its the info, that there was no rfid chip found
    )
    .subscribe({
        next(id) {
            client.trackEvent({ name: 'rfid:tag-recognized', properties: { id: id } });
            logger.info(`got id '${id}'`);
            switch (id) {
                case RfidController.EMPTY_TAG:
                    player.stop();
                    break;

                default:
                    const url = actionResolver.getUrlForAction(id);
                    if (url != null) {
                        player.play(url);
                    }
                    break;
            }
        },
        error(err) { logger.error('something wrong occurred: ' + err); },
        complete() { logger.info('done'); }
    });