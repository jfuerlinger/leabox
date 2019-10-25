
const clear = require('clear');
import { default as chalk } from 'chalk';

import * as readline from 'readline';


const log = console.log;

import { AudioPlayer } from './core/audio-player';
import { YoutubeAudioPlayerJS } from './core/youtube-audio-player-js';
import { ActionResolver } from './core/action-resolver';
import { DbActionResolver } from './core/db-action-resolver';
import { RfidController } from './core/rfid-controller'


const player: AudioPlayer = new YoutubeAudioPlayerJS();
const actionResolver: ActionResolver = new DbActionResolver();

clear();

readline.emitKeypressEvents(process.stdin);
//process.stdin.setRawMode(true);


process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit(); // eslint-disable-line no-process-exit
    } else if (key.ctrl && key.name === 'x') {
        log('TODO: stoping ...');
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

// const url = actionResolver.getUrlForAction("1");
// log(`URL='${url}'`);
const url = 'https://www.youtube.com/watch?v=sX8izWSnK7s';
log(chalk.green(url));
if (url != null) {
    player.play(url);
}

const rfidController = new RfidController();
rfidController
    .getObservable()
    .subscribe({
        next(id) { console.log(`got id '${id}'`); },
        error(err) { console.error('something wrong occurred: ' + err); },
        complete() { console.log('done'); }
    });